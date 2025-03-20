import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import { toast } from "react-hot-toast";
import useStore from "../../store/store.jsx";
import MediaAttachment from "../journal/MediaAttachment.jsx";
import WeatherWidget from "../journal/Weather.jsx";
import QuoteWidget from "../journal/Quote.jsx";
import MoodSelector from "../journal/MoodSelector.jsx";
import SectionTitle from "../common/SectionTitle.jsx";

// --- Main Journal Component ---

const Journal = () => {
	const journal = useStore((state) => state.store.journal);
	const setStore = useStore((state) => state.setStore);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [filesChanged, setFilesChanged] = useState(false);
	const [userLocation, setUserLocation] = useState(null);

	useEffect(() => {
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
							toast.error(
								"Could not retrieve location. Weather will use default."
							);
							setUserLocation("Dubai");
						}
					},
					(error) => {
						console.error("Geolocation error:", error);
						toast.error(
							"Geolocation is not supported or permission denied. Weather will use default location."
						);
						setUserLocation("Dubai");
					}
				);
			} else {
				toast.error("Geolocation is not supported by your browser.");
				setUserLocation("Dubai");
			}
		};

		getLocation();
	}, []);

	const today = new Date().toISOString().split("T")[0];

	const handleFileChange = (files, changed) => {
		setUploadedFiles(files);
		setFilesChanged(changed);
		console.log("files in parent", files);
	};

	const handleSubmit = () => {
		if (!journal?.date) {
			toast.error("Please select a date.");
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

		const journalData = {
			date: journal.date,
			mood: journal.mood,
			heading: journal.heading,
			body: journal.body,
			goal: journal.goal,
			affirmation: journal.affirmation,
			reflection: journal.reflection,
			files: uploadedFiles,
		};

		console.log("Submitting:", journalData);
		toast.success("Journal entry saved!");
	};

	return (
		<div className="bg-gradient-to-br from-brandGreen-50 to-brandGreen-100 rounded-xl shadow-lg border border-gray-200 p-8">
			<h2 className="text-2xl font-bold mb-6 text-brandGreen-500 border-b pb-3 text-center">
				My Journal
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Left column - Date and mood */}
				<div className="md:col-span-1 space-y-6">
					<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
						{/* Date input using full date */}
						<div className="mb-4">
							<SectionTitle>Date</SectionTitle>
							<Input
								name="date"
								type="date"
								state={journal?.date || today}
								setState={(val) => setStore("journal.date", val)}
								placeholder="Select date"
								className="border-2 border-brandGreen-100 focus:border-brandGreen-300"
							/>
						</div>

						{/* Mood selector with improved styling */}
						<div>
							<SectionTitle>Today's Mood</SectionTitle>

							<MoodSelector
								selectedMood={journal?.mood}
								onMoodChange={(emoji) => setStore("journal.mood", emoji)}
								className="flex justify-center item-center"
							/>
						</div>
					</div>

					{/* Weather card */}
					<WeatherWidget userLocation={userLocation} />

					{/* Quote card */}
					{/* <QuoteWidgetAPI /> */}
					<QuoteWidget />
				</div>

				{/* Main column - Journal content */}
				<div className="md:col-span-2 space-y-6">
					{/* Header section */}
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

					{/* Body section */}
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

					{/* Goal section */}
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

					{/* Personal growth section - combines affirmation and reflection */}
					<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
						<h3 className="text-lg font-medium text-gray-800 mb-3 text-center md:text-left">
							Personal Growth
						</h3>

						{/* Affirmation */}
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

						{/* Reflection with a sample question */}
						<div>
							<SectionTitle tooltip="Reflect on the day. Answer the question below">
								Reflection
							</SectionTitle>
							<div className="bg-brandGreen-50 rounded-lg p-3 mb-3 border border-brandGreen-100">
								<p className="text-sm text-brandGreen-800 font-medium">
									What was the most impactful moment of your day?
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

					{/* Media Attachments */}
					<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
						<MediaAttachment handleFileChange={handleFileChange} />
					</div>
				</div>
			</div>
			{/* Submit Button */}
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
