import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import useStore from "../../store/store.jsx";
import MediaAttachment from "../journal/MediaAttachment.jsx";
import WeatherWidget from "../journal/Weather.jsx";
import QuoteWidget from "../journal/Quote.jsx";
import MoodSelector from "../journal/MoodSelector.jsx";
import SectionTitle from "../common/SectionTitle.jsx";

// --- Constants ---
const TODAY_DATE = new Date().toISOString().split("T")[0]; // Calculate today's date once

// --- Main Journal Component ---
const initialJournalState = {
	// Use the constant for the initial default date
	date: TODAY_DATE,
	mood: "",
	heading: "",
	body: "",
	goal: "",
	affirmation: "",
	reflection: "",
	reflectionQuestion: "",
	media: [], // Assuming this might be part of the store structure, though not directly used here for files
	// uploadedFiles: [], // Local state handles this now
	rid: null, // Add rid for potential use in reflection question logic
	// Weather/Quote related fields should probably be added *after* fetching, not part of initial state
};

const Journal = () => {
	const journal = useStore((state) => state.store.journal);
	const setStore = useStore((state) => state.setStore);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	// Removed filesChanged state as it wasn't used in the submit logic provided
	const [userLocation, setUserLocation] = useState(null);
	const [mediaResetKey, setMediaResetKey] = useState(0);

	// Load draft on mount or ensure initial state has today's date
	useEffect(() => {
		const savedDraft = Cookies.get("journalDraft");
		let draftData = null;
		if (savedDraft) {
			try {
				draftData = JSON.parse(savedDraft);
			} catch (error) {
				console.error("Error parsing journal draft:", error);
				Cookies.remove("journalDraft"); // Remove corrupted draft
			}
		}

		// Merge initial state with draft, ensuring date is always set
		const initialStateWithDefaults = {
			...initialJournalState, // Start with base defaults
			...(draftData || {}), // Spread draft data if it exists
			date: draftData?.date || TODAY_DATE, // Prioritize draft date, fallback to TODAY
		};

		// Only update store if it's different or initially null/undefined
		// This check might be overkill depending on Zustand's behavior, but can prevent unnecessary renders
		// A simpler approach is often just `setStore('journal', initialStateWithDefaults);`
		if (JSON.stringify(journal) !== JSON.stringify(initialStateWithDefaults)) {
			setStore("journal", initialStateWithDefaults);
		}

		// Clean up potential old file state if loading from draft (though files aren't saved in draft)
		setUploadedFiles([]);
		setMediaResetKey((prev) => prev + 1); // Reset media component on initial load too
	}, [setStore]); // Only run once on mount

	// Fetch reflection question if not already set in the loaded journal state
	useEffect(() => {
		// Check specifically if reflectionQuestion is missing in the *current* journal state
		if (!journal?.reflectionQuestion) {
			const fetchReflectionQuestion = async () => {
				try {
					const response = await fetch(
						"http://localhost:5500/api/reflectionQuestion"
					);
					if (!response.ok) {
						throw new Error(`HTTP error: ${response.status}`);
					}
					const data = await response.json();
					// Update only the necessary fields, preserving the rest of the journal state
					setStore("journal.reflectionQuestion", data.question);
					setStore("journal.rid", data.rid);

					// Update the cookie immediately after fetching
					// Be careful here: get the *latest* state *before* updating the cookie
					const currentJournalState = useStore.getState().store.journal;
					Cookies.set(
						"journalDraft",
						JSON.stringify({
							...currentJournalState, // Use latest state from store
							reflectionQuestion: data.question,
							rid: data.rid,
						}),
						{ expires: 1 }
					);
				} catch (error) {
					console.error("Error fetching reflection question:", error);
					// Only set default question if fetch fails *and* it's still missing
					if (!useStore.getState().store.journal?.reflectionQuestion) {
						setStore(
							"journal.reflectionQuestion",
							"What was the most impactful moment of your day?"
						);
					}
				}
			};
			fetchReflectionQuestion();
		}
	}, [journal?.reflectionQuestion, setStore]); // Re-run if reflectionQuestion changes (e.g., gets cleared)

	// Write journal changes to cookie (debounced version could be better for performance)
	useEffect(() => {
		// Avoid saving if journal state hasn't been initialized yet
		if (journal && Object.keys(journal).length > 0) {
			Cookies.set("journalDraft", JSON.stringify(journal), { expires: 1 });
		}
	}, [journal]);

	// Get user location
	useEffect(() => {
		// ... (location fetching logic remains the same)
		const getLocation = async () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					async (position) => {
						const { latitude, longitude } = position.coords;
						try {
							const response = await fetch(
								`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
							);
							if (!response.ok) {
								throw new Error(`HTTP Error: ${response.status}`);
							}
							const data = await response.json();
							const locationString =
								data.city ||
								data.locality ||
								data.principalSubdivision ||
								"Unknown Location";
							setUserLocation(locationString);
						} catch (error) {
							console.error("Error getting location:", error);
							// Don't toast error here if defaulting is acceptable
							// toast.error("Could not retrieve location. Weather will use default.");
							setUserLocation("Dubai"); // Default location
						}
					},
					(error) => {
						console.error("Geolocation error:", error);
						// toast.error("Geolocation is not supported or permission denied. Weather will use default location.");
						setUserLocation("Dubai"); // Default location
					}
				);
			} else {
				// toast.error("Geolocation is not supported by your browser.");
				setUserLocation("Dubai"); // Default location
			}
		};

		getLocation();
	}, []); // Run only once on mount

	const handleFileChange = (files) => {
		// Only need files, not 'changed' state apparently
		setUploadedFiles(files);
		console.log("files in parent", files);
	};

	const handleSubmit = async () => {
		// Ensure date is valid before submission (though previous logic should prevent this)
		const dateToSubmit = journal?.date || TODAY_DATE;
		if (!dateToSubmit) {
			// Should theoretically never happen now
			toast.error("Date is missing. Please select or refresh.");
			return;
		}

		if (!journal?.heading) {
			toast.error("Please enter a journal title.");
			return;
		}
		if (!journal?.body) {
			toast.error("Please write your journal entry.");
			return;
		}
		if (!journal?.mood) {
			toast.error("Please select your mood.");
			return;
		}

		// Build the journal data payload.
		const journalData = {
			rid: journal.rid, // Make sure rid is populated from reflection fetch
			date: dateToSubmit, // Use the validated/defaulted date
			mood: journal.mood,
			title: journal.heading,
			body: journal.body,
			goal: journal.goal,
			affirmation: journal.affirmation,
			reflection_answer: journal.reflection,
			reflectionQuestion: journal.reflectionQuestion, // Ensure this is populated
			temperaturec: journal.temperaturec || null,
			temperaturef: journal.temperaturef || null,
			condition: journal.condition || null,
			location: userLocation || "Dubai", // Default location if not fetched
			quote: journal.quote?.q, // Access quote text safely
			quote_author: journal.quote?.a, // Access quote author safely
			media: uploadedFiles.map((file) => ({
				// Assuming backend expects specific structure for media
				// Adjust this mapping based on what your backend needs (e.g., file name, type, data URL?)
				// This example assumes you just need the file objects themselves, which is unlikely for JSON API.
				// You might need to upload files separately and send URLs/IDs instead.
				// FOR NOW: Sending minimal info, likely needs adjustment.
				name: file.name,
				type: file.type,
				size: file.size,
				// If you need to send file *content*, you'd typically use FormData, not JSON.
				// Or convert to base64 (not recommended for large files).
			})),
		};

		console.log("Submitting Journal Data:", journalData); // Log data before sending

		try {
			// **************************************************************
			// IMPORTANT: Sending files directly within JSON is usually not possible.
			// You typically need to use FormData for the request or upload files
			// separately and send back identifiers (like URLs or IDs).
			// The current `media: uploadedFiles` part will likely FAIL or
			// not work as intended with a standard JSON backend.
			// **************************************************************

			// Example using FormData (requires backend changes to handle multipart/form-data)
			const formData = new FormData();
			Object.keys(journalData).forEach((key) => {
				if (key !== "media") {
					// Append non-file data; handle null/undefined appropriately
					formData.append(key, journalData[key] ?? "");
				}
			});
			uploadedFiles.forEach((file, index) => {
				formData.append("media", file, file.name); // Key 'media' for each file
			});

			const response = await fetch("http://localhost:5500/api/journal", {
				method: "POST",
				// Remove 'Content-Type' header when using FormData; browser sets it correctly
				// headers: {
				// 	'Content-Type': 'application/json', // REMOVE THIS FOR FORMDATA
				// },
				credentials: "include",
				body: formData, // Use formData instead of JSON.stringify(journalData)
			});

			if (!response.ok) {
				const errorBody = await response.text(); // Get more error details
				throw new Error(
					`Failed to save journal entry: ${response.status} ${errorBody}`
				);
			}
			const result = await response.json();
			console.log("Journal entry saved:", result);
			toast.success("Journal entry saved!");

			// Reset state after successful submission
			setStore("journal", { ...initialJournalState, date: TODAY_DATE }); // Reset store to initial state with today's date
			setUploadedFiles([]); // Clear the local uploadedFiles state
			Cookies.remove("journalDraft"); // Remove the saved draft cookie
			setMediaResetKey((prev) => prev + 1); // Force remount of MediaAttachment
		} catch (error) {
			console.error("Error saving journal entry:", error);
			toast.error(`Failed to save journal entry: ${error.message}`);
		}
	};

	return (
		<div className="bg-gradient-to-br from-brandGreen-50 to-brandGreen-100 rounded-xl shadow-lg border border-gray-200 p-8">
			{/* ... Title ... */}
			<h2 className="text-2xl font-bold mb-6 text-brandGreen-500 border-b pb-3 text-center">
				My Journal
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Left column - Date and mood */}
				<div className="md:col-span-1 space-y-6">
					<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
						<div className="mb-4">
							<SectionTitle>Date</SectionTitle>
							<Input
								name="date"
								type="date"
								// Ensure state always has a value, fallback to TODAY_DATE if somehow null/undefined
								state={journal?.date || TODAY_DATE}
								// When input changes, set store value; if cleared, default to TODAY_DATE
								setState={(val) => setStore("journal.date", val || TODAY_DATE)}
								placeholder="Select date"
								className="border-2 border-brandGreen-100 focus:border-brandGreen-300"
							/>
						</div>
						<div>
							{/* ... Mood Selector ... */}
							<SectionTitle>Today's Mood</SectionTitle>
							<MoodSelector
								selectedMood={journal?.mood}
								onMoodChange={(emoji) => setStore("journal.mood", emoji)}
								className="flex justify-center item-center"
							/>
						</div>
					</div>
					{/* Widgets */}
					<WeatherWidget userLocation={userLocation} />
					<QuoteWidget />
				</div>

				{/* Main column - Journal content */}
				<div className="md:col-span-2 space-y-6">
					{/* ... Journal Title Input ... */}
					<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
						<SectionTitle tooltip="A short description about your day">
							Journal Title
						</SectionTitle>
						<Input
							name="heading"
							state={journal?.heading || ""}
							setState={(val) => setStore("journal.heading", val)}
							placeholder="Enter journal entry title"
							className="text-lg border-b-2 border-brandGreen-100 focus:border-brandGreen-300"
						/>
					</div>
					{/* ... Journal Body Textarea ... */}
					<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
						<SectionTitle tooltip="Write what happened during your day">
							Today's Story
						</SectionTitle>
						<textarea
							name="body"
							value={journal?.body || ""}
							onChange={(e) => setStore("journal.body", e.target.value)}
							rows={8}
							className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandGreen-200 focus:border-brandGreen-300 transition-colors"
							placeholder="Write your journal entry here..."
						/>
					</div>
					{/* ... Goal Input ... */}
					<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
						<SectionTitle tooltip="Optional: Set a short term or next day goal">
							Tomorrow's Goal
						</SectionTitle>
						<Input
							name="goal"
							state={journal?.goal || ""}
							setState={(val) => setStore("journal.goal", val)}
							placeholder="Enter your goal (optional)"
							className="border-b-2 border-brandGreen-100 focus:border-brandGreen-300"
						/>
					</div>
					{/* ... Personal Growth Section ... */}
					<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
						<h3 className="text-lg font-medium text-gray-800 mb-3 text-center md:text-left">
							Personal Growth
						</h3>
						<div className="mb-5">
							<SectionTitle tooltip="What did you learn today?">
								Today's Affirmation
							</SectionTitle>
							<Input
								name="affirmation"
								state={journal?.affirmation || ""}
								setState={(val) => setStore("journal.affirmation", val)}
								placeholder="Write what you learned today"
								className="border-b-2 border-brandGreen-100 focus:border-brandGreen-300"
							/>
						</div>
						<div>
							<SectionTitle tooltip="Reflect on the day. Answer the question below">
								Reflection
							</SectionTitle>
							<div className="bg-brandGreen-50 rounded-lg p-3 mb-3 border border-brandGreen-100">
								<p className="text-sm text-brandGreen-800 font-medium">
									{journal?.reflectionQuestion ||
										"Loading reflection question..."}
								</p>
							</div>
							<textarea
								name="reflection"
								value={journal?.reflection || ""}
								onChange={(e) => setStore("journal.reflection", e.target.value)}
								rows={4}
								className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandGreen-200 focus:border-brandGreen-300 transition-colors"
								placeholder="Share your reflections on this experience..."
							/>
						</div>
					</div>
					{/* ... Media Attachment ... */}
					<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
						<MediaAttachment
							key={mediaResetKey} // key prop forces remount on reset
							handleFileChange={handleFileChange}
							// Pass initial files (empty array after reset/load)
							initialFiles={[]}
						/>
					</div>
				</div>
			</div>
			{/* ... Submit Button ... */}
			<div className="mt-6 flex justify-end">
				<button
					type="button"
					onClick={handleSubmit}
					className="px-6 py-2 bg-brandGreen-600 text-white rounded-md hover:bg-brandGreen-700 focus:outline-none focus:ring-2 focus:ring-brandGreen-500 focus:ring-opacity-50 transition-colors"
				>
					Save Entry
				</button>
			</div>
		</div>
	);
};

export default Journal;
