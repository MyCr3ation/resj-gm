// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Import UUID
const cookieParser = require("cookie-parser");
const { createClient } = require("@supabase/supabase-js"); // Import Supabase
const bcrypt = require("bcrypt"); // Import bcrypt
const fs = require("fs");
const {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const app = express();
const port = process.env.PORT || 5500;

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Enable CORS for all routes
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"http://localhost:5500",
			"https://resj-gm-1.onrender.com",
		], // Adjust as needed for your frontend
		credentials: true, // Important: Allow sending cookies
	})
);

// Parse JSON bodies
app.use(bodyParser.json());
// Use cookie-parser middleware
app.use(cookieParser());

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
	console.log("Uploads folder created.");
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir); // Use the created uploads folder
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 100 * 1024 * 1024 }, // limit to 100MB per file
});

app.post("/api/upload", upload.single("file"), (req, res) => {
	if (!req.file) {
		console.error("No file uploaded");
		return res.status(400).json({ error: "No file uploaded" });
	}
	res.json({ message: "File uploaded successfully", file: req.file });
});

// Endpoint to proxy the Quote API
app.get("/api/quote", async (req, res) => {
	try {
		const response = await axios.get("https://zenquotes.io/api/today");
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching quote:", error);
		res.status(500).json({ error: "Error fetching quote" });
	}
});

// Endpoint to proxy the Weather API
app.get("/api/weather", async (req, res) => {
	const weatherAPI = process.env.WEATHER_API;
	const location = req.query.location || "Dubai";

	try {
		const response = await axios.get(
			`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
				location
			)}?contentType=json&key=${weatherAPI}`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching weather:", error);
		res.status(500).json({ error: "Error fetching weather" });
	}
});

// Endpoint to retrieve a reflection question
app.get("/api/reflectionQuestion", async (req, res) => {
	try {
		// Query the reflection table for all records
		const { data, error } = await supabase.from("reflection").select("*");

		if (error) {
			console.error("Error fetching reflection questions:", error);
			return res
				.status(500)
				.json({ error: "Error fetching reflection questions" });
		}

		if (!data || data.length === 0) {
			return res.status(404).json({ error: "No reflection questions found" });
		}

		// Optionally, if you have multiple reflection questions,
		// select one at random to return:
		const randomIndex = Math.floor(Math.random() * data.length);
		const selectedReflection = data[randomIndex];

		res.json(selectedReflection);
	} catch (err) {
		console.error("Error in /api/reflectionQuestion:", err);
		res.status(500).json({ error: "Internal server error" });
	}
});

// In-memory storage for journal entries (replace with Supabase for persistence)
let journalEntries = [];

// Endpoint to add a journal entry along with its media
app.post("/api/journal", async (req, res) => {
	console.log("Received journal entry:", req.body);
	try {
		// Destructure the journal data from the request body
		const {
			date,
			mood,
			title, // maps to "title" column (journal title)
			body,
			goal,
			affirmation,
			reflectionQuestion, // Reflection Question to find the rid
			reflection_answer,
			location,
			temperaturec,
			temperaturef,
			condition,
			quote,
			quote_author,
			media, // Optional array of media objects: each { mediatype, filePath }
		} = req.body;

		// Get the usid from cookie (ensure your client has set the cookie "usid")
		const usid = req.cookies.usid;
		if (!usid) {
			return res.status(401).json({ error: "User not authenticated" });
		}

		// Query the session table to retrieve the user_uid based on the usid.
		const { data: sessionRecord, error: sessionQueryError } = await supabase
			.from("session")
			.select("user_uid")
			.eq("usid", usid)
			.maybeSingle();

		if (sessionQueryError || !sessionRecord) {
			return res.status(401).json({ error: "User session not found" });
		}

		let uid = sessionRecord.user_uid; // Now you have the user's uid.

		const { data: reflectionQuestionRecord, error: reflectionQueryError } =
			await supabase
				.from("reflection")
				.select("rid")
				.eq("question", reflectionQuestion)
				.maybeSingle();

		if (reflectionQueryError || !reflectionQuestionRecord) {
			return res.status(401).json({ error: "Reflection Question not Found" });
		}

		const rid = reflectionQuestionRecord.rid;

		// Insert the journal entry into the "journal" table.
		// created_at and updated_at are assumed to be handled automatically (or you can set them here).
		const { data: journalData, error: journalError } = await supabase
			.from("journal")
			.insert([
				{
					uid,
					rid,
					date,
					mood,
					title,
					body,
					goal,
					affirmation,
					reflection_answer,
					location,
					temperaturec,
					temperaturef,
					condition,
					quote,
					quote_author,
				},
			])
			.select();

		if (journalError) {
			console.error("Error inserting journal entry:", journalError);
			return res.status(500).json({ error: "Failed to insert journal entry" });
		}

		// Get the generated journal id from the insert result
		const journalId = journalData[0].id;

		// If there is media data, process each media item.
		// Process each media item if any
		if (media && Array.isArray(media)) {
			// Setup S3 client using AWS SDK v3
			const s3Client = new S3Client({
				endpoint: "https://dkswqfkufgcfvectiaph.supabase.co/storage/v1/s3",
				region: "ap-south-1",
				credentials: {
					accessKeyId: process.env.SUPABASE_STORAGE_ACCESS_KEY, // Set in your .env file
					secretAccessKey: process.env.SUPABASE_STORAGE_SECRET_KEY, // Set in your .env file
				},
				forcePathStyle: true,
			});

			for (const item of media) {
				// Ensure each media item has a valid filePath and mediatype
				if (!item.filePath || !item.mediatype) continue;

				try {
					// Read the file from disk
					const fileBuffer = fs.readFileSync(item.filePath);
					const fileName = path.basename(item.filePath);
					// Construct a unique storage path for the file inside a folder for this journal entry
					const storagePath = `journal_${journalId}/${Date.now()}_${fileName}`;

					// Create and send the PutObjectCommand using the v3 client
					const putCommand = new PutObjectCommand({
						Bucket: "media-data", // Your bucket name
						Key: storagePath,
						Body: fileBuffer,
						ContentType: item.mediatype,
					});
					await s3Client.send(putCommand);

					// Construct the public URL manually. This URL pattern assumes that your bucket is public.
					const publicURL = `https://dkswqfkufgcfvectiaph.supabase.co/storage/v1/object/public/media-data/${storagePath}`;

					// Insert a record for the media in the "media" table
					const { error: mediaInsertError } = await supabase
						.from("media")
						.insert([
							{
								jid: journalId, // FK linking to the journal entry
								mediatype: item.mediatype,
								mediaurl: publicURL,
							},
						]);
					if (mediaInsertError) {
						console.error("Error inserting media record:", mediaInsertError);
					}
				} catch (err) {
					console.error("Error processing media item with S3:", err);
				}
			}
		}

		return res.json({
			message: "Journal entry saved successfully",
			journalEntry: journalData[0],
		});
	} catch (error) {
		console.error("Error in /api/journal:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// --- Google OAuth and User/Session Management ---

app.post("/api/auth", async (req, res) => {
	try {
		const { name, email, provider, providerid } = req.body;

		if (!email || !provider || !providerid) {
			return res.status(400).json({
				error: "Missing required fields (email, provider, providerid)",
			});
		}

		// 1. Check if the user already exists
		const { data: existingUser, error: userError } = await supabase
			.from("user")
			.select("*")
			.eq("email", email)
			.maybeSingle(); // Use maybeSingle to handle both 0 and 1 result

		if (userError) {
			console.error("Error checking for existing user:", userError);
			return res.status(500).json({ error: "Database error" });
		}

		let userId;

		if (existingUser) {
			// 2. User exists: Update providerid if necessary (e.g., if they previously signed up with email/password)
			userId = existingUser.uid;
			if (
				existingUser.provider !== provider ||
				existingUser.providerid !== providerid
			) {
				const { error: updateError } = await supabase
					.from("user")
					.update({ provider, providerid })
					.eq("uid", userId);

				if (updateError) {
					console.error("Error updating user:", updateError);
					return res.status(500).json({ error: "Database error" });
				}
			}
		} else {
			// 3. User does not exist: Create a new user
			const { data: newUser, error: insertError } = await supabase
				.from("user")
				.insert([
					{
						name: name || "Default Name", // Use a default if name is missing
						email,
						provider,
						providerid,
					},
				])
				.select(); // Important:  Select returns the newly created row

			if (insertError) {
				console.error("Error inserting user:", insertError);
				return res.status(500).json({ error: "Database error" });
			}
			userId = newUser[0].uid; // Get the UID from the returned data
		}

		// 4. Generate USID
		const usid = uuidv4();

		// 5. Store USID in a cookie (HTTP-only, secure in production)
		res.cookie("usid", usid, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Use secure cookies in production
			maxAge: 24 * 60 * 60 * 1000, // 1 day (in milliseconds).  Adjust as needed.
			sameSite: "lax", // Recommended for security
		});

		// 6. (Optional) Store USID in the 'session' table
		const { error: sessionError } = await supabase.from("session").insert([
			{
				usid,
				user_uid: userId, // Use the obtained userId
				//expires_at:  // Add expiration logic if needed
			},
		]);

		if (sessionError) {
			console.error("Error creating session:", sessionError);
			// Don't necessarily return an error, as the cookie is the primary session mechanism
		}

		// 7. Send success response
		res.status(200).json({ message: "Authentication successful" });
	} catch (error) {
		console.error("Error in /api/auth:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Add a simple protected route example (using middleware)

const authenticateUser = async (req, res, next) => {
	const usid = req.cookies.usid;

	if (!usid) {
		return res.status(401).json({ error: "Unauthorized: No USID cookie" });
	}

	try {
		// Validate USID and get user_uid from session table
		const { data: sessionData, error: sessionError } = await supabase
			.from("session")
			.select("user_uid")
			.eq("usid", usid)
			.maybeSingle(); // Use maybeSingle in case session expired/doesn't exist

		if (sessionError) {
			console.error("Error validating session:", sessionError);
			return res.status(500).json({ error: "Session validation error" });
		}

		if (!sessionData) {
			// Clear the invalid cookie and deny access
			res.clearCookie("usid", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
			});
			return res
				.status(401)
				.json({ error: "Unauthorized: Invalid or expired session" });
		}

		// Attach user_uid and usid to the request object
		req.user_uid = sessionData.user_uid;
		req.usid = usid;
		next(); // Continue to the next middleware/route handler
	} catch (error) {
		console.error("Error in authenticateUser middleware:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

app.get("/api/protected", authenticateUser, (req, res) => {
	// If we reach here, the user is authenticated
	res.json({ message: "This is a protected route", usid: req.usid });
});

//Logout endpoint
app.post("/api/logout", async (req, res) => {
	const usid = req.cookies.usid;
	if (usid) {
		// Delete the session from the 'session' table
		const { error } = await supabase.from("session").delete().eq("usid", usid);
		if (error) {
			console.error("Error deleting session:", error);
			// Optionally, handle the error (but still clear the cookie to log out the user)
		}
	}

	// Clear the cookie
	res.clearCookie("usid", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});
	res.status(200).json({ message: "Logged out successfully" });
});

// --- Manual Signup and Login ---

app.post("/api/signup", async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		// Check if user already exists (using email)
		const { data: existingUser, error: userError } = await supabase
			.from("user")
			.select("*")
			.eq("email", email)
			.maybeSingle();

		if (userError) {
			console.error("Database error:", userError);
			return res.status(500).json({ error: "Database error" });
		}

		if (existingUser) {
			return res
				.status(409)
				.json({ error: "User with this email already exists" }); // 409 Conflict
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

		// Create the new user
		const { data: newUser, error: insertError } = await supabase
			.from("user")
			.insert([
				{
					name,
					email,
					password: hashedPassword,
					provider: "email", // Mark as email signup
				},
			])
			.select();

		if (insertError) {
			console.error("Error inserting user:", insertError);
			return res
				.status(500)
				.json({ error: "Database error during user creation" });
		}

		// Create session (same as Google Auth)
		const usid = uuidv4();
		res.cookie("usid", usid, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 24 * 60 * 60 * 1000,
			sameSite: "lax",
		});

		const { error: sessionError } = await supabase.from("session").insert([
			{
				usid,
				user_uid: newUser[0].uid, // Use the obtained userId
				//expires_at:  // Add expiration logic if needed
			},
		]);

		if (sessionError) {
			console.log("Error creating session: ", sessionError);
		}
		res.status(201).json({ message: "Signup successful" }); // 201 Created
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.post("/api/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		// Retrieve the user by email
		const { data: user, error: userError } = await supabase
			.from("user")
			.select("*")
			.eq("email", email)
			.maybeSingle();

		if (userError) {
			console.error("Database error:", userError);
			return res.status(500).json({ error: "Database error" });
		}

		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" }); // 401 Unauthorized
		}

		// Compare the password
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.status(401).json({ error: "Invalid credentials" }); // 401 Unauthorized
		}

		// Create session (same as Google Auth and signup)
		const usid = uuidv4();
		res.cookie("usid", usid, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 24 * 60 * 60 * 1000,
			sameSite: "lax",
		});
		const { error: sessionError } = await supabase.from("session").insert([
			{
				usid,
				user_uid: user.uid, // Use the obtained userId
				//expires_at:  // Add expiration logic if needed
			},
		]);

		if (sessionError) {
			console.log("Error creating a session: ", sessionError);
		}
		res.status(200).json({ message: "Login successful" });
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// server.js (Add this endpoint)

// Endpoint to get all journal entries for the authenticated user
// server.js (Relevant Endpoint)

app.get("/api/alljournal", authenticateUser, async (req, res) => {
	try {
		const user_uid = req.user_uid; // Get user_uid from middleware

		// 1. Fetch journal entries for the user
		const { data: journalEntriesData, error: journalError } = await supabase
			.from("journal")
			.select("*")
			.eq("uid", user_uid)
			.order("date", { ascending: false });

		if (journalError) {
			console.error("Error fetching journal entries:", journalError);
			return res.status(500).json({ error: "Failed to fetch journal entries" });
		}

		if (!journalEntriesData || journalEntriesData.length === 0) {
			return res.json([]); // Return empty array if no entries found
		}

		// 2. For each journal entry, fetch associated media
		//    Promise.all ensures we wait for all media fetches to complete
		const entriesWithMedia = await Promise.all(
			// Map over each fetched journal entry
			journalEntriesData.map(async (entry) => {
				// Fetch media specifically for the current entry's ID (entry.id)
				const { data: mediaData, error: mediaError } = await supabase
					.from("media") // Query the 'media' table
					.select("mediaurl, mediatype") // Select the URL and type
					.eq("jid", entry.id); // ***** CRITICAL STEP *****
				// Filter media where the 'jid' column
				// matches the current journal 'entry.id'

				if (mediaError) {
					console.error(
						`Error fetching media for journal ${entry.id}:`,
						mediaError
					);
					// If media fetch fails for one entry, return the entry without media
					// instead of failing the whole request.
					return { ...entry, media: [] }; // Attach an empty array for 'media'
				}

				// Combine the original entry data with its fetched media data.
				// If mediaData is null/undefined (no media found), use an empty array.
				// The result is { ...originalEntryData, media: [ {mediaurl, mediatype}, ... ] }
				// or { ...originalEntryData, media: [] } if no media found.
				return { ...entry, media: mediaData || [] };
			}) // End of .map()
		); // End of Promise.all()

		// 3. Send the final array of journal entries, each potentially containing a 'media' array
		res.json(entriesWithMedia);
	} catch (error) {
		// Catch any broader errors during the process
		console.error("Error in GET /api/alljournal:", error); // Corrected log message
		res.status(500).json({ error: "Internal server error" });
	}
});

// Endpoint to get a single journal entry by ID for the authenticated user
app.get("/api/journal/:id", authenticateUser, async (req, res) => {
	try {
		const user_uid = req.user_uid; // Get user_uid from middleware
		const journalId = req.params.id; // Get journal ID from URL parameter

		if (!journalId) {
			return res.status(400).json({ error: "Journal ID is required" });
		}

		// 1. Fetch the specific journal entry, ensuring it belongs to the user
		const { data: journalEntryData, error: journalError } = await supabase
			.from("journal")
			.select(
				`
                *,
                reflection ( question ) 
            `
			) // Fetch related reflection question directly
			.eq("id", journalId)
			.eq("uid", user_uid) // IMPORTANT: Ensure ownership
			.maybeSingle(); // Use maybeSingle as we expect 0 or 1 result

		if (journalError) {
			console.error("Error fetching single journal entry:", journalError);
			return res.status(500).json({ error: "Failed to fetch journal entry" });
		}

		if (!journalEntryData) {
			// Entry not found or doesn't belong to the user
			return res
				.status(404)
				.json({ error: "Journal entry not found or access denied" });
		}

		// 2. Fetch associated media for this entry
		const { data: mediaData, error: mediaError } = await supabase
			.from("media")
			.select("mediaurl, mediatype")
			.eq("jid", journalId); // Filter by the journal ID

		if (mediaError) {
			console.error(
				`Error fetching media for journal ${journalId}:`,
				mediaError
			);
			// Decide how to handle: return entry without media or error out?
			// Let's return the entry but log the media error.
			journalEntryData.media = []; // Assign empty array if media fetch fails
		} else {
			journalEntryData.media = mediaData || []; // Assign fetched media or empty array
		}

		// 3. Restructure the data slightly to match FullJournalView expectations
		const responseData = {
			id: journalEntryData.id,
			date: journalEntryData.date,
			mood: journalEntryData.mood,
			title: journalEntryData.title,
			body: journalEntryData.body,
			goal: journalEntryData.goal,
			affirmation: journalEntryData.affirmation,
			reflection: {
				// Combine question and answer into one object
				question: journalEntryData.reflection?.question || "No question found", // Handle if reflection relation is null
				answer: journalEntryData.reflection_answer,
			},
			grateful: journalEntryData.grateful, // Assuming 'grateful' is a direct column
			weather: {
				location: journalEntryData.location,
				temperatureC: journalEntryData.temperaturec,
				temperatureF: journalEntryData.temperaturef,
				condition: journalEntryData.condition,
			},
			quote: {
				q: journalEntryData.quote,
				a: journalEntryData.quote_author,
			},
			media: journalEntryData.media.map((m) => ({
				// Map backend structure to frontend expectation if needed
				type: m.mediatype?.startsWith("image/")
					? "image"
					: m.mediatype?.startsWith("video/")
					? "video"
					: m.mediatype?.startsWith("audio/")
					? "audio"
					: "unknown", // Determine type based on mediatype
				url: m.mediaurl,
				alt: `Media for journal ${journalId}`, // Add generic alt text or derive if possible
			})),
		};

		// 4. Send the combined data
		res.json(responseData);
	} catch (error) {
		console.error("Error in GET /api/journal/:id:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// --- Helper function to setup S3 Client (reuse if needed) ---
const getS3Client = () => {
	return new S3Client({
		endpoint: "https://dkswqfkufgcfvectiaph.supabase.co/storage/v1/s3",
		region: "ap-south-1", // Your region
		credentials: {
			accessKeyId: process.env.SUPABASE_STORAGE_ACCESS_KEY,
			secretAccessKey: process.env.SUPABASE_STORAGE_SECRET_KEY,
		},
		forcePathStyle: true,
	});
};
// -------------------------------------------------------------

// Endpoint to UPDATE a journal entry by ID for the authenticated user
app.put("/api/journal/:id", authenticateUser, async (req, res) => {
	try {
		const user_uid = req.user_uid;
		const journalId = req.params.id;
		// Get data from request body - VALIDATE THIS THOROUGHLY in a real app
		const {
			date,
			mood,
			title,
			body,
			goal,
			affirmation,
			reflection_answer,
			// Note: We don't typically allow editing reflectionQuestion, weather, quote via this form
			// Note: Media editing is complex and not included in this basic PUT
		} = req.body;

		// Basic validation example
		if (!date || !mood || !title || !body) {
			return res.status(400).json({ error: "Missing required fields." });
		}

		// Construct update object - only include fields being updated
		const updateData = {
			date,
			mood,
			title,
			body,
			goal: goal || null, // Handle optional fields
			affirmation: affirmation || null,
			reflection_answer: reflection_answer || null,
			updated_at: new Date(), // Manually set updated_at timestamp
		};

		// Perform the update, ensuring ownership
		const { data: updatedEntry, error: updateError } = await supabase
			.from("journal")
			.update(updateData)
			.eq("id", journalId)
			.eq("uid", user_uid) // CRITICAL: Ensure user owns the entry
			.select() // Select the updated record
			.maybeSingle(); // Expect one record or null

		if (updateError) {
			console.error("Error updating journal entry:", updateError);
			return res.status(500).json({ error: "Failed to update journal entry" });
		}

		if (!updatedEntry) {
			// This could happen if the ID doesn't exist OR if the user_uid doesn't match
			return res
				.status(404)
				.json({ error: "Journal entry not found or access denied" });
		}

		// TODO: Add complex media update logic here if needed in the future.
		// This would involve:
		// 1. Getting list of existing media URLs from DB for this journalId.
		// 2. Getting list of media URLs client wants to KEEP.
		// 3. Getting list of NEW files client uploaded (via multer or similar).
		// 4. Deleting media from S3/DB that are NOT in the "keep" list.
		// 5. Uploading NEW files to S3 and adding records to DB.

		// Return the updated entry (or just a success message)
		// Fetching the full related data again might be needed if you want to return the same structure as GET /:id
		res.json(updatedEntry); // For now, just return the directly updated fields
	} catch (error) {
		console.error("Error in PUT /api/journal/:id:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Endpoint to DELETE a journal entry by ID for the authenticated user
app.delete("/api/journal/:id", authenticateUser, async (req, res) => {
	try {
		const user_uid = req.user_uid;
		const journalId = req.params.id;

		// 1. Check if the journal entry exists and belongs to the user before proceeding
		const { data: journalCheck, error: checkError } = await supabase
			.from("journal")
			.select("id") // Select minimal data
			.eq("id", journalId)
			.eq("uid", user_uid)
			.maybeSingle();

		if (checkError) {
			console.error("Error checking journal ownership:", checkError);
			return res.status(500).json({ error: "Database error during check" });
		}

		if (!journalCheck) {
			return res
				.status(404)
				.json({ error: "Journal entry not found or access denied" });
		}

		// 2. Fetch associated media URLs
		const { data: mediaToDelete, error: mediaFetchError } = await supabase
			.from("media")
			.select("mediaurl")
			.eq("jid", journalId);

		if (mediaFetchError) {
			console.error(
				`Error fetching media for journal ${journalId} during delete:`,
				mediaFetchError
			);
			// Log error but proceed with deleting DB records if desired, or halt here
			// return res.status(500).json({ error: "Failed to fetch media for deletion" });
		}

		// 3. Delete media files from S3 storage (if any found)
		if (mediaToDelete && mediaToDelete.length > 0) {
			const s3Client = getS3Client();
			const bucketName = "media-data"; // Your bucket name

			for (const mediaItem of mediaToDelete) {
				try {
					// Extract the object key from the URL
					// Example URL: https://<project_ref>.supabase.co/storage/v1/object/public/media-data/journal_10/1678886400000_image.jpg
					// Key: journal_10/1678886400000_image.jpg
					const urlParts = new URL(mediaItem.mediaurl);
					const key = urlParts.pathname.split(`/public/${bucketName}/`)[1]; // Adjust parsing based on your exact URL structure

					if (key) {
						const deleteCommand = new DeleteObjectCommand({
							Bucket: bucketName,
							Key: key,
						});
						await s3Client.send(deleteCommand);
						console.log(`Deleted from S3: ${key}`);
					} else {
						console.warn(`Could not parse key from URL: ${mediaItem.mediaurl}`);
					}
				} catch (s3Error) {
					console.error(
						`Error deleting file ${mediaItem.mediaurl} from S3:`,
						s3Error
					);
					// Log error but continue trying to delete DB records
				}
			}
		}

		// 4. Delete media records from the database
		const { error: mediaDeleteError } = await supabase
			.from("media")
			.delete()
			.eq("jid", journalId);

		if (mediaDeleteError) {
			console.error(
				`Error deleting media records for journal ${journalId}:`,
				mediaDeleteError
			);
			// Log error, but proceed to delete the main journal entry
		}

		// 5. Delete the journal entry itself
		const { error: journalDeleteError } = await supabase
			.from("journal")
			.delete()
			.eq("id", journalId)
			.eq("uid", user_uid); // Redundant check due to step 1, but safe

		if (journalDeleteError) {
			console.error("Error deleting journal entry:", journalDeleteError);
			return res.status(500).json({ error: "Failed to delete journal entry" });
		}

		// 6. Send success response
		res.status(200).json({ message: "Journal entry deleted successfully" });
		// Or use 204 No Content: res.status(204).send();
	} catch (error) {
		console.error("Error in DELETE /api/journal/:id:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.delete("/api/journal/:id/media", authenticateUser, async (req, res) => {
	try {
		const user_uid = req.user_uid;
		const journalId = req.params.id;
		const { mediaUrl } = req.body;

		if (!mediaUrl) {
			return res.status(400).json({ error: "mediaUrl is required" });
		}

		// Verify that the journal entry belongs to the user
		const { data: journalCheck } = await supabase
			.from("journal")
			.select("id")
			.eq("id", journalId)
			.eq("uid", user_uid)
			.maybeSingle();

		if (!journalCheck) {
			return res
				.status(404)
				.json({ error: "Journal entry not found or access denied" });
		}

		// Get the media record from the database
		const { data: mediaRecord } = await supabase
			.from("media")
			.select("*")
			.eq("jid", journalId)
			.eq("mediaurl", mediaUrl)
			.maybeSingle();

		if (!mediaRecord) {
			return res.status(404).json({ error: "Media not found" });
		}

		// Delete the file from Supabase Storage (S3)
		const s3Client = getS3Client();
		const bucketName = "media-data"; // your bucket name
		const urlParts = new URL(mediaUrl);
		// Assumes URL pattern includes "/public/media-data/"
		const key = urlParts.pathname.split(`/public/${bucketName}/`)[1];

		if (key) {
			const deleteCommand = new DeleteObjectCommand({
				Bucket: bucketName,
				Key: key,
			});
			await s3Client.send(deleteCommand);
			console.log(`Deleted from S3: ${key}`);
		} else {
			console.warn(`Could not parse key from URL: ${mediaUrl}`);
		}

		// Delete the media record from the database
		const { error: deleteError } = await supabase
			.from("media")
			.delete()
			.eq("jid", journalId)
			.eq("mediaurl", mediaUrl);

		if (deleteError) {
			console.error("Error deleting media record:", deleteError);
			return res.status(500).json({ error: "Failed to delete media record" });
		}

		res.status(200).json({ message: "Media deleted successfully" });
	} catch (error) {
		console.error("Error deleting media:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
