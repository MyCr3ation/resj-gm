// FullJournalView.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
	AiOutlineInfoCircle,
	AiOutlineCloud,
	AiOutlineSmile, // Keep if used elsewhere, otherwise can remove
	AiOutlineStar,
	AiOutlineCheckCircle,
	AiOutlineEdit,
	AiOutlineDelete,
} from "react-icons/ai";
import { BsSun, BsFillCloudSunFill, BsChatSquareQuote } from "react-icons/bs";
import DynamicImage from "../common/DynamicImage.jsx";

// --- Helper Functions ---
const weatherIcon = (condition) => {
	switch (condition?.toLowerCase()) {
		case "sunny":
		case "clear":
			return <BsSun size={24} className="text-yellow-500" />;
		case "cloudy":
			return <AiOutlineCloud size={24} className="text-gray-500" />;
		case "partly cloudy":
		case "partly-cloudy":
			return <BsFillCloudSunFill size={24} className="text-blue-300" />;
		default:
			return <AiOutlineCloud size={24} className="text-gray-500" />;
	}
};
// --- End Helper Functions ---

const FullJournalView = ({ journalEntry }) => {
	const navigate = useNavigate();
	const { journalId } = useParams();

	if (!journalEntry) {
		return (
			<div className="p-8 text-center text-brandGreen-700">
				Journal data is not available.
			</div>
		);
	}

	// --- Format Date ---
	const formattedDate = new Date(journalEntry.date).toLocaleDateString(
		"en-US",
		{
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			timeZone: "UTC",
		}
	);

	// --- Handlers for Edit and Delete ---
	const handleEdit = () => {
		navigate(`/journal/edit/${journalId}`);
	};

	const handleDelete = async () => {
		if (
			window.confirm(
				"Are you sure you want to permanently delete this journal entry?"
			)
		) {
			const toastId = toast.loading("Deleting entry...");
			try {
				const response = await axios.delete(
					`${import.meta.env.VITE_API_URL}/api/journal/${journalId}`,
					{
						withCredentials: true,
					}
				);

				if (response.status === 200 || response.status === 204) {
					toast.success("Journal entry deleted successfully!", { id: toastId });
					navigate("/journal/view");
				} else {
					throw new Error(response.data?.error || "Deletion failed");
				}
			} catch (err) {
				console.error("Error deleting journal entry:", err);
				toast.error(
					`Deletion failed: ${err.response?.data?.error || err.message}`,
					{ id: toastId }
				);
			}
		}
	};
	// --- End Handlers ---

	// Define sections data (excluding Quote for now)
	const sections = [
		{
			title: "Tomorrow's Goal",
			content: journalEntry.goal,
			icon: AiOutlineCheckCircle,
			tooltip: "Your short term goal you needed to achieve.",
		},
		{
			title: "Today's Affirmation",
			content: journalEntry.affirmation,
			icon: AiOutlineStar,
			tooltip: "Your affirmation for the day.",
		},
		{
			title: "Reflection",
			content: journalEntry.reflection, // Passed as object { question, answer }
			icon: AiOutlineInfoCircle,
			tooltip: "Reflect on the day.",
		},
	];

	return (
		<div className="bg-brandGreen-50 rounded-3xl shadow-2xl overflow-hidden w-full p-6 md:p-10">
			{/* Header */}
			<div className="flex items-center justify-between mb-6 border-b border-brandGreen-200 pb-4">
				<h1 className="text-3xl md:text-4xl font-extrabold text-brandGreen-800 flex items-center break-words mr-4">
					{journalEntry.title || "Untitled Entry"}
				</h1>
				{journalEntry.mood && (
					<div className="text-3xl flex-shrink-0">{journalEntry.mood}</div>
				)}
			</div>

			{/* Date */}
			<p className="text-gray-600 text-lg mb-8">{formattedDate}</p>

			{/* Main Journal Body */}
			{journalEntry.body && (
				<div
					className="prose prose-brandGreen max-w-none text-brandGreen-700 leading-relaxed mb-8"
					style={{ whiteSpace: "pre-wrap" }}
				>
					{journalEntry.body}
				</div>
			)}

			{/* Weather Section (Placed separately before the grid) */}
			{journalEntry.weather?.location && (
				<div className="mb-8 bg-brandGreen-100 p-5 rounded-xl shadow-md">
					<h3 className="text-xl font-semibold text-brandGreen-700 mb-3 flex items-center">
						<div className="mr-2">
							{weatherIcon(journalEntry.weather.condition)}
						</div>
						Weather
					</h3>
					<p className="text-brandGreen-600">
						Location: {journalEntry.weather.location}
					</p>
					{(journalEntry.weather.temperatureC !== null ||
						journalEntry.weather.temperatureF !== null) && (
						<p className="text-brandGreen-600">
							Temperature:{" "}
							{journalEntry.weather.temperatureC !== null
								? `${journalEntry.weather.temperatureC}°C`
								: ""}
							{journalEntry.weather.temperatureC !== null &&
							journalEntry.weather.temperatureF !== null
								? " / "
								: ""}
							{journalEntry.weather.temperatureF !== null
								? `${journalEntry.weather.temperatureF}°F`
								: ""}
						</p>
					)}
					{journalEntry.weather.condition && (
						<p className="text-brandGreen-600 capitalize">
							Condition: {journalEntry.weather.condition}
						</p>
					)}
				</div>
			)}

			{/* Sections Grid (Goal, Affirmation, Reflection, Quote) */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
				{sections.map((section, index) => {
					// Skip rendering if content is empty (except for Reflection which checks nested)
					if (!section.content && section.title !== "Reflection") return null;

					// Special handling for Reflection object
					if (section.title === "Reflection") {
						if (
							!section.content || // Check if reflection object exists
							(!section.content.question && !section.content.answer)
						) {
							return null; // Skip if reflection or its contents are empty
						}
						return (
							<div
								key={index}
								className="bg-brandGreen-100 p-5 rounded-xl shadow-md"
							>
								<h3 className="text-xl font-semibold text-brandGreen-700 mb-3 flex items-center">
									<section.icon
										className="mr-2 text-brandGreen-500"
										size={20}
									/>
									{section.title}
									<AiOutlineInfoCircle
										title={section.tooltip}
										className="ml-2 text-brandGreen-400 cursor-pointer"
									/>
								</h3>
								{section.content.question &&
									section.content.question !== "No question found" && (
										<p className="text-brandGreen-600 font-medium italic mb-1">
											"{section.content.question}"
										</p>
									)}
								{section.content.answer && (
									<p
										className="text-brandGreen-600"
										style={{ whiteSpace: "pre-wrap" }}
									>
										{section.content.answer}
									</p>
								)}
							</div>
						);
					}

					// Standard rendering for other sections
					return (
						<div
							key={index}
							className="bg-brandGreen-100 p-5 rounded-xl shadow-md"
						>
							<h3 className="text-xl font-semibold text-brandGreen-700 mb-3 flex items-center">
								<section.icon className="mr-2 text-brandGreen-500" size={20} />
								{section.title}
								<AiOutlineInfoCircle
									title={section.tooltip}
									className="ml-2 text-brandGreen-400 cursor-pointer"
								/>
							</h3>
							<p
								className="text-brandGreen-600"
								style={{ whiteSpace: "pre-wrap" }}
							>
								{section.content}
							</p>
						</div>
					);
				})}

				{/* Quote Section - Rendered within the same grid */}
				{journalEntry.quote?.q && (
					<div className="bg-brandGreen-100 p-5 rounded-xl shadow-md">
						<div>
							<h3 className="text-xl font-semibold text-brandGreen-700 mb-3 flex items-center">
								<BsChatSquareQuote
									className="mr-2 text-brandGreen-500"
									size={20}
								/>
								Quote
							</h3>
							<blockquote className="italic text-brandGreen-600">
								"{journalEntry.quote.q}"
								{journalEntry.quote.a && (
									<span className="not-italic block text-right mt-1">
										- {journalEntry.quote.a}
									</span>
								)}
							</blockquote>
						</div>
					</div>
				)}
			</div>

			{/* Media Section */}
			{journalEntry.media && journalEntry.media.length > 0 && (
				<div className="mt-8">
					<h3 className="text-2xl font-semibold text-brandGreen-700 mb-4">
						Media
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{journalEntry.media.map((item, index) => {
							if (item.type === "image") {
								return (
									<div
										key={index}
										className="relative group aspect-w-1 aspect-h-1"
									>
										<DynamicImage
											src={item.url}
											alt={item.alt || `Journal media ${index + 1}`}
											className="rounded-lg object-cover w-full h-full transition-transform duration-300 transform group-hover:scale-105"
										/>
										{item.alt && (
											<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
												<p className="text-white text-center px-4 text-sm">
													{item.alt}
												</p>
											</div>
										)}
									</div>
								);
							} else if (item.type === "video") {
								return (
									<div
										key={index}
										className="relative sm:col-span-2 lg:col-span-1"
									>
										<video
											controls
											className="w-full h-auto rounded-lg shadow-md"
										>
											<source src={item.url} type="video/mp4" />
											Your browser does not support the video tag.
										</video>
									</div>
								);
							} else if (item.type === "audio") {
								return (
									<div
										key={index}
										className="bg-brandGreen-100 p-4 rounded-lg shadow-md"
									>
										<audio controls className="w-full">
											<source src={item.url} type="audio/mpeg" />
											Your browser does not support the audio element.
										</audio>
									</div>
								);
							}
							return null;
						})}
					</div>
				</div>
			)}

			{/* Edit and Delete Buttons */}
			<div className="mt-8 pt-6 border-t border-brandGreen-200 flex justify-end space-x-4">
				<button
					onClick={handleEdit}
					className="inline-flex items-center px-4 py-2 border border-brandGreen-500 text-sm font-medium rounded-md text-brandGreen-700 bg-white hover:bg-brandGreen-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandGreen-500 transition duration-150 ease-in-out"
				>
					<AiOutlineEdit className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
					Edit
				</button>
				<button
					onClick={handleDelete}
					className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
				>
					<AiOutlineDelete className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
					Delete
				</button>
			</div>
		</div>
	);
};

export default FullJournalView;
