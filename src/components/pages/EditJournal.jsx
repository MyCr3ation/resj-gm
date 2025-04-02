// src/components/pages/EditJournal.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai"; // For remove media button
// Import common components
import Input from "../common/Input.jsx";
import SectionTitle from "../common/SectionTitle.jsx";
import MoodSelector from "../journal/MoodSelector.jsx";
import MediaAttachment from "../journal/MediaAttachment.jsx"; // Keep for adding new media

const EditJournal = () => {
	const { journalId } = useParams();
	const navigate = useNavigate();

	const handleDeleteMedia = async (mediaUrl) => {
		if (
			window.confirm(
				"Are you sure you want to permanently delete this image? This action cannot be undone."
			)
		) {
			try {
				await axios.delete(`${VITE_API_URL}/api/journal/${journalId}/media`, {
					data: { mediaUrl },
					withCredentials: true,
				});
				toast.success("Media deleted successfully.");
				// Remove the deleted media from the local state so it no longer displays
				setOriginalData((prev) => ({
					...prev,
					media: prev.media.filter((media) => media.url !== mediaUrl),
				}));
			} catch (error) {
				console.error("Error deleting media:", error);
				toast.error("Failed to delete media.");
			}
		}
	};

	// State for editable form fields
	const [formData, setFormData] = useState(null);
	// State for original data (non-editable + existing media)
	const [originalData, setOriginalData] = useState({
		weather: null,
		quote: null,
		reflectionQuestion: "",
		media: [], // To store existing media details
	});
	// State to track which existing media URLs to remove on save
	const [mediaToRemove, setMediaToRemove] = useState([]);
	// State for newly uploaded files (if adding new media functionality is used)
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [filesChanged, setFilesChanged] = useState(false); // Track if new files were selected

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const VITE_API_URL =
		import.meta.env.VITE_API_URL ||
		"https://resj-gm-1.onrender.com" ||
		"http://localhost:5500";

	// --- Fetch Data ---
	useEffect(() => {
		let isMounted = true;
		const fetchJournalData = async () => {
			if (!journalId) {
				if (isMounted) {
					setError("Journal ID is missing.");
					setIsLoading(false);
				}
				return;
			}
			if (isMounted) {
				setIsLoading(true);
				setError(null);
			}

			try {
				const response = await axios.get(
					`${VITE_API_URL}/api/journal/${journalId}`,
					{ withCredentials: true }
				);
				if (isMounted) {
					const data = response.data;
					// Populate editable form state
					console.log("Fetched journal data:", data);
					setFormData({
						date: data.date?.split("T")[0] || "",
						mood: data.mood || "",
						heading: data.title,
						body: data.body || "",
						goal: data.goal, // Correct mapping
						affirmation: data.affirmation, // Correct mapping
						reflection: data.reflection?.answer || "",
					});

					// Populate state for non-editable/original data
					setOriginalData({
						weather: data.weather, // Keep weather object
						quote: data.quote,
						reflectionQuestion:
							data.reflection?.question || "Could not load question.",
						media: data.media || [], // Store existing media [{ url: '...', type: '...' }]
					});
				}
			} catch (err) {
				if (isMounted) {
					console.error("Error fetching journal data:", err);
					const errorMsg =
						err.response?.data?.error ||
						err.message ||
						"Failed to load journal data.";
					setError(errorMsg);
					toast.error(`Error: ${errorMsg}`);
				}
			} finally {
				if (isMounted) setIsLoading(false);
			}
		};
		fetchJournalData();
		return () => {
			isMounted = false;
		};
	}, [journalId, VITE_API_URL]);

	// --- Handlers ---
	const handleChange = useCallback((e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	}, []);

	const handleFileChange = useCallback((files, changed) => {
		setUploadedFiles(files);
		setFilesChanged(changed);
		console.log("New files selected in EditJournal:", files);
	}, []);

	const handleMoodChange = useCallback((emoji) => {
		setFormData((prev) => ({ ...prev, mood: emoji }));
	}, []);

	// Handler to mark an existing media item for removal
	const handleRemoveExistingMedia = useCallback((mediaUrl) => {
		// Add the URL to the removal list if not already there
		setMediaToRemove((prev) =>
			prev.includes(mediaUrl) ? prev : [...prev, mediaUrl]
		);
		toast.success("Media marked for removal. Save changes to confirm.", {
			duration: 2500,
		});
	}, []);

	// Confirmation prompt before marking for removal
	const confirmRemoveExistingMedia = (mediaUrl) => {
		if (
			window.confirm(
				"Are you sure you want to remove this media? This action cannot be undone after saving."
			)
		) {
			handleRemoveExistingMedia(mediaUrl);
		}
	};

	// Filter existing media to display only those not marked for removal
	const displayedExistingMedia = originalData.media.filter(
		(media) => !mediaToRemove.includes(media.url)
	);

	// --- Submit Handler ---
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		const toastId = toast.loading("Updating entry...");

		// Basic Validation
		if (
			!formData?.date ||
			!formData?.mood ||
			!formData?.heading ||
			!formData?.body
		) {
			toast.error("Please fill in Date, Mood, Title, and Story.", {
				id: toastId,
			});
			setIsSubmitting(false);
			return;
		}

		// --- Data Preparation ---
		// Using FormData to handle potential file uploads along with text data
		const submissionData = {
			date: formData.date,
			mood: formData.mood,
			title: formData.heading,
			body: formData.body,
			goal: formData.goal || "",
			affirmation: formData.affirmation || "",
			reflection_answer: formData.reflection || "",
		};

		// Append information about media to remove (if backend supports it)
		// Backend needs to be updated to process 'mediaToRemove' field
		if (mediaToRemove.length > 0) {
			// Send as JSON string or multiple entries, depending on backend implementation
			submissionData.append("mediaToRemove", JSON.stringify(mediaToRemove));
			console.log(
				"Sending intent to remove media (ensure backend handles 'mediaToRemove'):",
				mediaToRemove
			);
			toast.info(
				"Note: Media removal processing depends on backend implementation.",
				{ duration: 4000 }
			);
		}

		// Append new files if any were added
		if (filesChanged && uploadedFiles.length > 0) {
			uploadedFiles.forEach((file) => {
				submissionData.append("media", file);
			});
			console.log(
				"Sending new files (ensure backend handles 'media' field):",
				uploadedFiles
			);
			toast(
				"Note: New media upload processing depends on backend implementation.",
				{ duration: 4000 }
			);
		}

		try {
			// Use PUT with FormData
			await axios.put(
				`${VITE_API_URL}/api/journal/${journalId}`,
				submissionData,
				{
					withCredentials: true,
				}
			);
			toast.success("Journal entry updated successfully!", { id: toastId });
			setMediaToRemove([]); // Clear removal list on successful update
			setFilesChanged(false); // Reset file change flag
			setUploadedFiles([]); // Clear uploaded files list
			// Consider fetching the updated data again or directly navigating
			navigate(`/journal/view/${journalId}`);
		} catch (err) {
			console.error("Error updating journal entry:", err);
			const errorMsg =
				err.response?.data?.error || err.message || "Update failed";
			toast.error(`Update failed: ${errorMsg}`, { id: toastId });
		} finally {
			setIsSubmitting(false);
		}
	};

	// --- Render Logic ---
	if (isLoading) {
		return (
			<div className="flex justify-center items-center pt-20">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brandGreen-500"></div>
				<p className="ml-4 text-brandGreen-700 text-lg">
					Loading Journal for Editing...
				</p>
			</div>
		);
	}

	if (error || !formData) {
		return (
			<div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center max-w-md mx-auto mt-10">
				<p className="font-bold text-lg mb-2">Error Loading Editor</p>
				<p className="mb-4">{error || "Could not load journal data."}</p>
				<button
					onClick={() => navigate("/journal/view")}
					className="mt-4 px-4 py-2 bg-brandGreen-600 text-white rounded hover:bg-brandGreen-700"
				>
					Back to Journal List
				</button>
			</div>
		);
	}

	// --- Form ---
	return (
		<form
			onSubmit={handleSubmit}
			className="bg-gradient-to-br from-brandGreen-50 to-brandGreen-100 rounded-xl shadow-lg border border-gray-200 p-6 md:p-8"
		>
			<h2 className="text-3xl font-bold mb-6 text-brandGreen-700 border-b border-brandGreen-200 pb-3 text-center">
				Edit Journal Entry
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* --- Left column (Non-editable context + Date/Mood) --- */}
				<div className="md:col-span-1 space-y-6">
					<div className="bg-white rounded-lg shadow p-5 border border-gray-100">
						<SectionTitle>Date</SectionTitle>
						<Input
							name="date"
							type="date"
							required
							state={formData.date}
							onChange={handleChange}
							max={new Date().toISOString().split("T")[0]}
							className="border-2 border-brandGreen-100 focus:border-brandGreen-300"
						/>
					</div>
					<div className="bg-white rounded-lg shadow p-5 border border-gray-100">
						<SectionTitle>Mood</SectionTitle>
						<MoodSelector
							selectedMood={formData.mood}
							onMoodChange={handleMoodChange}
							className="flex justify-around items-center py-2"
						/>
					</div>
					{/* --- Weather Display (Read Only) --- */}
					{originalData.weather && (
						<div className="bg-white rounded-lg shadow p-5 border border-gray-100">
							<SectionTitle>Weather Conditions</SectionTitle>
							<div className="text-gray-700 mt-2 text-sm">
								{originalData.weather.temperatureC && (
									<p>
										<strong>Temperature Celcius:</strong>{" "}
										{originalData.weather.temperatureC}°C
									</p>
								)}
								{originalData.weather.temperatureF && (
									<p>
										<strong>Temperature Farenheit:</strong>{" "}
										{originalData.weather.temperatureF}°F
									</p>
								)}
								{originalData.weather.condition && (
									<p>
										<strong>Condition:</strong> {originalData.weather.condition}
									</p>
								)}
								{originalData.weather.location && (
									<p>
										<strong>Location:</strong> {originalData.weather.location}
									</p>
								)}
								{!originalData.weather.temperature &&
									!originalData.weather.condition &&
									!originalData.weather.location && (
										<p className="italic text-gray-500">
											Weather data not available.
										</p>
									)}
							</div>
						</div>
					)}
					{/* Display original Quote (Read Only) if available */}
					{originalData.quote && originalData.quote.text && (
						<div className="bg-white rounded-lg shadow p-5 border border-gray-100">
							<SectionTitle>Quote of the Day</SectionTitle>
							<blockquote className="mt-2 italic text-gray-600 text-sm border-l-4 border-brandGreen-200 pl-3 py-1">
								"{originalData.quote.text}"
								{originalData.quote.author && (
									<footer className="text-xs text-gray-500 mt-1">
										- {originalData.quote.author}
									</footer>
								)}
							</blockquote>
						</div>
					)}
				</div>

				{/* --- Main column (Editable fields) --- */}
				<div className="md:col-span-2 space-y-6">
					<div className="bg-white rounded-lg shadow p-5 border border-gray-100">
						<SectionTitle tooltip="A short description about your day">
							Journal Title
						</SectionTitle>
						<Input
							name="heading"
							required
							state={formData.heading} // Use value instead of state for controlled component
							onChange={handleChange}
							placeholder="Give your entry a title..."
							className="text-lg border-b-2 border-brandGreen-100 focus:border-brandGreen-300"
						/>
					</div>

					<div className="bg-white rounded-lg shadow p-5 border border-gray-100">
						<SectionTitle tooltip="Write what happened during your day">
							Today's Story
						</SectionTitle>
						<textarea
							name="body"
							rows={8}
							required
							value={formData.body}
							onChange={handleChange}
							className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandGreen-200 focus:border-brandGreen-300"
							placeholder="Write about your day..."
						/>
					</div>

					<div className="bg-white rounded-lg shadow p-5 border border-gray-100">
						<SectionTitle tooltip="Optional: Set a short term or next day goal">
							Tomorrow's Goal
						</SectionTitle>
						<Input
							name="goal"
							state={formData.goal || ""} // Controlled component needs value
							onChange={handleChange}
							placeholder="What's one thing you want to achieve tomorrow? (Optional)"
							className="border-b-2 border-brandGreen-100 focus:border-brandGreen-300"
						/>
					</div>

					{/* Personal Growth Section */}
					<div className="bg-white rounded-lg shadow p-5 border border-gray-100">
						<h3 className="text-xl font-semibold text-brandGreen-600 mb-4 text-center md:text-left">
							Personal Growth
						</h3>
						<div className="mb-5">
							<SectionTitle tooltip="A positive statement about yourself or what you learned">
								Affirmation / Learning
							</SectionTitle>
							<Input
								name="affirmation"
								state={formData.affirmation || ""} // Controlled component needs value
								onChange={handleChange}
								placeholder="e.g., 'I am capable...' or 'Learned about...'"
								className="border-b-2 border-brandGreen-100 focus:border-brandGreen-300"
							/>
						</div>
						<div>
							<SectionTitle tooltip="Reflect on the day by answering the question">
								Reflection
							</SectionTitle>
							<div className="bg-brandGreen-50 rounded-lg p-3 mb-3 border border-brandGreen-100">
								<p className="text-sm text-brandGreen-800 font-medium italic">
									{/* Display original question */}
									{originalData.reflectionQuestion || "Reflection Question"}
								</p>
							</div>
							<textarea
								name="reflection"
								rows={4}
								value={formData.reflection}
								onChange={handleChange}
								className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandGreen-200 focus:border-brandGreen-300"
								placeholder="Share your thoughts..."
							/>
						</div>
					</div>

					{/* --- Display Existing Media --- */}
					{displayedExistingMedia.map((media, index) => (
						<div
							key={index}
							className="relative group border rounded-md overflow-hidden shadow-sm"
						>
							{media.type === "image" || media.type.startsWith("image/") ? (
								<img
									src={media.url}
									alt={`Journal media ${index + 1}`}
									className="w-full h-full object-cover"
								/>
							) : media.type.startsWith("video/") ? (
								<video
									controls
									src={media.url}
									className="w-full h-full object-cover bg-black"
								/>
							) : media.type === "audio" || media.type.startsWith("audio/") ? (
								<audio controls src={media.url} className="w-full" />
							) : (
								<div className="w-full h-full flex items-center justify-center bg-gray-100 text-xs text-gray-500 p-2">
									<a
										href={media.url}
										target="_blank"
										rel="noopener noreferrer"
										className="hover:underline truncate"
									>
										{media.url.split("/").pop()}
									</a>
								</div>
							)}

							{/* Updated Delete Button */}
							<button
								type="button"
								onClick={() => handleDeleteMedia(media.url)}
								className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-75 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-400"
								aria-label="Delete image"
								title="Delete this image"
								disabled={isSubmitting}
							>
								<AiOutlineDelete size={16} />
							</button>
						</div>
					))}

					{/* --- Add New Media ---
					<div className="bg-white rounded-lg shadow p-5 border border-gray-100">
						<SectionTitle>Add New Media (Optional)</SectionTitle>
						<MediaAttachment
							handleFileChange={handleFileChange}
							maxFiles={5 - displayedExistingMedia.length}
						/>
						<p className="text-xs text-gray-500 mt-1">
							You can add up to {5 - displayedExistingMedia.length} more files.
						</p>
					</div> */}
				</div>
			</div>

			{/* --- Action Buttons --- */}
			<div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
				<button
					type="button"
					onClick={() => navigate(`/journal/view/${journalId}`)}
					disabled={isSubmitting}
					className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={
						isSubmitting ||
						(mediaToRemove.length === 0 &&
							!filesChanged &&
							JSON.stringify({
								// Disable if nothing changed (compare text fields)
								date: formData?.date,
								mood: formData?.mood,
								heading: formData?.heading,
								body: formData?.body,
								goal: formData?.goal,
								affirmation: formData?.affirmation,
								reflection: formData?.reflection,
							}) ===
								JSON.stringify({
									date: originalData.date?.split("T")[0] || "", // Need original text fields here for comparison
									mood: originalData.mood || "",
									heading: originalData.title,
									body: originalData.body || "",
									goal: originalData.goal,
									affirmation: originalData.affirmation,
									reflection: originalData.reflection?.answer || "",
								}))
					}
					className="px-8 py-2 bg-brandGreen-600 text-white rounded-md font-semibold hover:bg-brandGreen-700 focus:outline-none focus:ring-2 focus:ring-brandGreen-500 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isSubmitting ? "Saving..." : "Save Changes"}
				</button>
			</div>
		</form>
	);
};

export default EditJournal;
