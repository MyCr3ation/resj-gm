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

const app = express();
const port = process.env.PORT || 5500;

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Enable CORS for all routes
app.use(
	cors({
		origin: ["http://localhost:5173", "http://localhost:5500"], // Adjust as needed for your frontend
		credentials: true, // Important: Allow sending cookies
	})
);

// Parse JSON bodies
app.use(bodyParser.json());
// Use cookie-parser middleware
app.use(cookieParser());

// Set up file upload using multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/"); // Ensure you create this folder in your project root
	},
	filename: function (req, file, cb) {
		// Use a timestamp plus original file name
		cb(null, Date.now() + "-" + file.originalname);
	},
});
const upload = multer({
	storage,
	limits: { fileSize: 100 * 1024 * 1024 }, // limit to 100MB
});

// Endpoint to upload media attachments
app.post("/api/upload", upload.single("file"), (req, res) => {
	if (!req.file) {
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

// Endpoint to save a journal entry
app.post("/api/journal", (req, res) => {
	const journalEntry = req.body;
	// Basic validation
	if (!journalEntry.date || !journalEntry.heading || !journalEntry.body) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	journalEntry.id = journalEntries.length + 1;
	journalEntries.push(journalEntry);
	res.json({ message: "Journal entry saved successfully", journalEntry });
});

// Endpoint to retrieve all journal entries
app.get("/api/journal", (req, res) => {
	res.json(journalEntries);
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
		return res.status(401).json({ error: "Unauthorized: No USID" });
	}

	// You could also query the 'session' table here to validate the USID against the database.
	//  This would be important for features like forced logout or session expiry.

	req.usid = usid; // Attach the usid to the request object for later use
	next(); // Continue to the next middleware/route handler
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

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
