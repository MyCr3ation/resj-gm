import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import { toast } from "react-hot-toast";
import useStore from "../../store/store.jsx";
import { AiOutlineInfoCircle } from "react-icons/ai";
import MediaAttachment from "../journal/MediaAttachment.jsx";

// --- Helper Components ---

const SectionTitle = ({ children, tooltip }) => (
	<h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center justify-center md:justify-start">
		{children}
		{tooltip && (
			<AiOutlineInfoCircle
				title={tooltip}
				className="inline ml-2 cursor-pointer text-brandGreen-400"
			/>
		)}
	</h3>
);

// --- Widget Components ---

const WeatherWidget = ({ userLocation }) => {
	const [temperatureF, setTemperatureF] = useState(null); // Store Fahrenheit
	const [temperatureC, setTemperatureC] = useState(null); // Store Celsius
	const [weatherLocation, setWeatherLocation] = useState(null);
	const [error, setError] = useState(null);
	const [unit, setUnit] = useState("F"); // 'F' for Fahrenheit, 'C' for Celsius
	const apiKey =
		import.meta.env.VITE_WEATHER_API_KEY || "DXGDMD85JK5YF4YE649LHSUSA";

	useEffect(() => {
		const fetchWeather = async () => {
			if (!userLocation) return;

			try {
				const response = await fetch(
					`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
						userLocation
					)}?contentType=json&key=${apiKey}&unitGroup=us` // Use unitGroup=us for F, metric for C
				);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const data = await response.json();
				if (data && data.days && data.days.length > 0) {
					const tempF = data.days[0].temp;
					setTemperatureF(tempF);
					setTemperatureC(convertFtoC(tempF)); // Calculate Celsius
					setWeatherLocation(data.resolvedAddress);
					setError(null);
				} else {
					setError("No weather data available for your location.");
				}
			} catch (err) {
				console.error("Error fetching weather:", err);
				setError(err.message || "Failed to fetch weather data. Check network.");
			}
		};

		fetchWeather();
	}, [userLocation]);

	const convertFtoC = (fahrenheit) => {
		return ((fahrenheit - 32) * 5) / 9;
	};

	const convertCtoF = (celsius) => {
		return (celsius * 9) / 5 + 32;
	};

	const toggleUnit = () => {
		setUnit((prevUnit) => (prevUnit === "F" ? "C" : "F"));
	};

	return (
		<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
			<SectionTitle>Weather</SectionTitle>
			{error ? (
				<p className="text-red-500 text-sm">{error}</p>
			) : (
				<>
					<p className="text-sm">Location: {weatherLocation || "Loading..."}</p>
					<p className="text-sm">
						Temperature:{" "}
						{unit === "F"
							? temperatureF !== null
								? `${temperatureF.toFixed(1)}°F` //toFixed() to keep it neat
								: "Loading..."
							: temperatureC !== null
							? `${temperatureC.toFixed(1)}°C`
							: "Loading..."}
					</p>
					<button
						type="button"
						onClick={toggleUnit}
						className="px-4 py-1 mt-2 bg-brand text-black rounded hover:bg-brandGreen-600 transition-colors"
					>
						Convert to {unit === "F" ? "°C" : "°F"}
					</button>
				</>
			)}
		</div>
	);
};

const QuoteWidgetAPI = () => {
	const [quote, setQuote] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchQuote = async () => {
			try {
				const response = await fetch("http://localhost:5500/api/quote"); // Use your proxy
				if (!response.ok) {
					throw new Error(`HTTP Error: ${response.status}`);
				}
				const data = await response.json();
				if (data && data.length > 0) {
					setQuote(data[0]);
				} else {
					setQuote({ q: "No quote available.", a: "Unknown" });
				}
			} catch (error) {
				console.error("Error fetching quote:", error);
				setError("Failed to load quote. Check network or try again later.");
				setQuote({ q: "Failed to load quote", a: "Error" });
			}
		};

		fetchQuote();
	}, []);

	return (
		<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
			<SectionTitle>Quote</SectionTitle>
			{error && <p className="text-red-500 text-sm">{error}</p>}
			{quote ? (
				<blockquote className="italic text-sm">
					"{quote.q}" - {quote.a}
				</blockquote>
			) : (
				<p className="text-sm">Loading Quote...</p>
			)}
		</div>
	);
};

const QuoteWidget = () => {
	const [quote, setQuote] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchQuote = async () => {
			try {
				const response = await fetch(
					"https://cors-anywhere.herokuapp.com/https://zenquotes.io/api/today"
				);
				if (!response.ok) {
					throw new Error(`HTTP Error: ${response.status}`);
				}
				const data = await response.json();
				if (data?.length > 0) {
					setQuote(data[0]);
					setError(null);
				} else {
					setQuote({ q: "No quote available.", a: "Unknown" });
				}
			} catch (error) {
				console.error("Error fetching quote:", error);
				try {
					const response = await fetch("https://zenquotes.io/api/today");
					if (!response.ok) {
						throw new Error(`HTTP Error: ${response.status}`);
					}
					const data = await response.json();
					if (data?.length > 0) {
						setQuote(data[0]);
						setError(null);
					} else {
						setQuote({ q: "No quote available.", a: "Unknown" });
					}
				} catch (error) {
					console.error("Error fetching quote:", error);
					setError("Failed to load quote. Check network or try again later.");
					setQuote({ q: "Failed to load quote.", a: "Error" }); // Set error quote
				}
			}
		};
		fetchQuote();
	}, []);

	return (
		<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
			<SectionTitle>Quote</SectionTitle>
			{error && <p className="text-red-500 text-sm">{error}</p>}
			{quote ? (
				<blockquote className="italic text-sm">
					"{quote.q}" - {quote.a}
				</blockquote>
			) : (
				<p className="text-sm">Loading...</p>
			)}
		</div>
	);
};

const MoodSelector = ({ selectedMood, onMoodChange }) => {
	const moods = ["😊", "😔", "😠", "😢", "😄"];

	return (
		<div className="bg-brandGreen-50 rounded-lg p-3 border border-brandGreen-100">
			<div className="flex space-x-2 justify-center md:justify-start">
				{moods.map((mood) => (
					<button
						key={mood}
						type="button"
						className={`text-2xl hover:scale-110 transition-transform ${
							selectedMood === mood ? "scale-110" : ""
						}`}
						onClick={() => onMoodChange(mood)}
					>
						{mood}
					</button>
				))}
			</div>
		</div>
	);
};

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
							setUserLocation("Mumbai");
						}
					},
					(error) => {
						console.error("Geolocation error:", error);
						toast.error(
							"Geolocation is not supported or permission denied. Weather will use default location."
						);
						setUserLocation("Mumbai");
					}
				);
			} else {
				toast.error("Geolocation is not supported by your browser.");
				setUserLocation("Mumbai");
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
					className="px-6 py-2 bg-brandGreen-600 text-black rounded-md hover:bg-brandGreen-700 focus:outline-none focus:ring-2 focus:ring-brandGreen-500 focus:ring-opacity-50 transition-colors"
				>
					Save Entry
				</button>
			</div>
		</div>
	);
};

export default Journal;
