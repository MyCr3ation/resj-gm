// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const multer = require("multer");
const path = require("path");

const app = express();
const port = process.env.PORT || 5500;

// Enable CORS for all routes
app.use(cors());

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

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
