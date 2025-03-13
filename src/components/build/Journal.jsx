import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import { toast } from "react-hot-toast";
import useStore from "../../store/store.jsx";
import { AiOutlineInfoCircle } from "react-icons/ai";

// Component to fetch and display weather info
const WeatherWidget = () => {
	const [temperature, setTemperature] = useState(null);

	useEffect(() => {
		const fetchWeather = async () => {
			try {
				const response = await fetch(
					"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Mumbai?contentType=json&key=DXGDMD85JK5YF4YE649LHSUSA"
				);
				const data = await response.json();
				if (data && data.days && data.days.length > 0) {
					// Display the "temp" value from the first day's data
					setTemperature(data.days[0].temp);
				}
			} catch (error) {
				console.error("Error fetching weather:", error);
			}
		};
		fetchWeather();
	}, []);

	return (
		<div className="mb-4">
			<h3 className="text-md font-medium">Weather</h3>
			<p>
				Temperature: {temperature !== null ? `${temperature}°F` : "Loading..."}
			</p>
		</div>
	);
};

// Component to fetch and display today's quote
const QuoteWidget = () => {
	const [quote, setQuote] = useState(null);

	useEffect(() => {
		const fetchQuote = async () => {
			try {
				const response = await fetch("https://zenquotes.io/api/today");
				const data = await response.json();
				if (data && data.length > 0) {
					setQuote(data[0]);
				}
			} catch (error) {
				console.error("Error fetching quote:", error);
			}
		};
		fetchQuote();
	}, []);

	return (
		<div className="mb-4">
			<h3 className="text-md font-medium">Quote</h3>
			{quote ? (
				<blockquote className="italic">
					"{quote.q}" - {quote.a}
				</blockquote>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

// Component to let the user select their current mood via emojis
const MoodSelector = ({ mood, onSelect }) => {
	const moods = ["😀", "😢", "😡", "😎", "😐"];

	return (
		<div className="mb-4">
			<h3 className="text-md font-medium">
				Mood{" "}
				<AiOutlineInfoCircle
					title="Select your current mood"
					className="inline ml-1 cursor-pointer"
				/>
			</h3>
			<div className="flex space-x-2">
				{moods.map((emoji) => (
					<button
						key={emoji}
						type="button"
						onClick={() => onSelect(emoji)}
						className={`text-2xl ${
							mood === emoji ? "border-2 border-blue-500 rounded" : ""
						}`}
					>
						{emoji}
					</button>
				))}
			</div>
		</div>
	);
};

const Journal = () => {
	const journal = useStore((state) => state.store.journal);
	const setStore = useStore((state) => state.setStore);

	// For file attachments (photos, video, audio)
	const handleFileChange = (e) => {
		const { name, files } = e.target;

		if (files.length > 0) {
			const file = files[0];
			// Check file size (max 100MB)
			if (file.size > 100 * 1024 * 1024) {
				toast.error("File size should not exceed 100MB");
				e.target.value = "";
				return;
			}
			// Store the file reference in the state
			setStore(`journal.${name}`, file);
			toast.success(
				`${name.charAt(0).toUpperCase() + name.slice(1)} uploaded successfully`
			);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<h2 className="text-xl font-semibold mb-6">Journal Entry</h2>

			{/* Weather component */}
			<WeatherWidget />

			{/* Mood selector */}
			<MoodSelector
				mood={journal?.mood}
				onSelect={(emoji) => setStore("journal.mood", emoji)}
			/>

			{/* Date input using full date */}
			<div className="mb-4">
				<Input
					label="Date"
					name="date"
					type="date"
					state={journal?.date || ""}
					setState={(val) => setStore("journal.date", val)}
					placeholder="Select date"
				/>
			</div>

			{/* Header / Short description */}
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">
					Header{" "}
					<AiOutlineInfoCircle
						title="A short description about your day"
						className="inline ml-1 cursor-pointer"
					/>
				</label>
				<Input
					label="Header"
					name="heading"
					state={journal?.heading || ""}
					setState={(val) => setStore("journal.heading", val)}
					placeholder="Enter journal entry title"
				/>
			</div>

			{/* Body text area */}
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">
					Body{" "}
					<AiOutlineInfoCircle
						title="Write what happened during your day"
						className="inline ml-1 cursor-pointer"
					/>
				</label>
				<textarea
					name="body"
					value={journal?.body || ""}
					onChange={(e) => setStore("journal.body", e.target.value)}
					rows={6}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					placeholder="Write your journal entry here..."
				/>
			</div>

			{/* Optional goal */}
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">
					Goal{" "}
					<AiOutlineInfoCircle
						title="Optional: Set a short term or next day goal"
						className="inline ml-1 cursor-pointer"
					/>
				</label>
				<Input
					label="Goal"
					name="goal"
					state={journal?.goal || ""}
					setState={(val) => setStore("journal.goal", val)}
					placeholder="Enter your goal (optional)"
				/>
			</div>

			{/* Affirmation */}
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">
					Affirmation{" "}
					<AiOutlineInfoCircle
						title="What did you learn today?"
						className="inline ml-1 cursor-pointer"
					/>
				</label>
				<Input
					label="Affirmation"
					name="affirmation"
					state={journal?.affirmation || ""}
					setState={(val) => setStore("journal.affirmation", val)}
					placeholder="Write what you learned today"
				/>
			</div>

			{/* Reflection with a sample question */}
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">
					Reflection{" "}
					<AiOutlineInfoCircle
						title="Reflect on the day. Answer the question below"
						className="inline ml-1 cursor-pointer"
					/>
				</label>
				<p className="mb-2 text-sm text-gray-500">
					What was the most impactful moment of your day?
				</p>
				<textarea
					name="reflection"
					value={journal?.reflection || ""}
					onChange={(e) => setStore("journal.reflection", e.target.value)}
					rows={4}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					placeholder="Share your reflections on this experience..."
				/>
			</div>

			{/* Affiliation */}
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700">
					Affiliation{" "}
					<AiOutlineInfoCircle
						title="Enter related affiliation or context"
						className="inline ml-1 cursor-pointer"
					/>
				</label>
				<Input
					label="Affiliation"
					name="affiliation"
					state={journal?.affiliation || ""}
					setState={(val) => setStore("journal.affiliation", val)}
					placeholder="Enter related affiliation or context"
				/>
			</div>

			{/* Quote component (no info icon as requested) */}
			<QuoteWidget />

			{/* Media Attachments */}
			<div className="mb-4">
				<h3 className="text-md font-medium">
					Media Attachments (Max 100MB each)
				</h3>

				<div className="mb-2">
					<label className="block text-sm font-medium text-gray-700">
						Photos{" "}
						<AiOutlineInfoCircle
							title="Upload photos relevant to your journal"
							className="inline ml-1 cursor-pointer"
						/>
					</label>
					<input
						type="file"
						name="photo"
						accept="image/*"
						onChange={handleFileChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="mb-2">
					<label className="block text-sm font-medium text-gray-700">
						Video{" "}
						<AiOutlineInfoCircle
							title="Upload a video relevant to your journal"
							className="inline ml-1 cursor-pointer"
						/>
					</label>
					<input
						type="file"
						name="video"
						accept="video/*"
						onChange={handleFileChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="mb-2">
					<label className="block text-sm font-medium text-gray-700">
						Audio{" "}
						<AiOutlineInfoCircle
							title="Upload an audio clip relevant to your journal"
							className="inline ml-1 cursor-pointer"
						/>
					</label>
					<input
						type="file"
						name="audio"
						accept="audio/*"
						onChange={handleFileChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>
		</div>
	);
};

export default Journal;
