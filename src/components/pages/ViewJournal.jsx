// ViewJournal.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import axios (or use fetch)
import {
	AiOutlineSearch,
	AiOutlineClear,
	AiOutlineDown,
	AiOutlineUp,
} from "react-icons/ai";
import { FiFilter } from "react-icons/fi"; // Filter Icon
import Pagination from "../common/Pagination.jsx";
import HappyIMG from "../../assets/bgtheme/Happy.png";
import SadIMG from "../../assets/bgtheme/Sad.png";
import AngryIMG from "../../assets/bgtheme/Angry.png";
import TearfulIMG from "../../assets/bgtheme/Tearful.png";
import JoyfulIMG from "../../assets/bgtheme/Joyful.png";

// --- Default Mood Images (Replace with your actual URLs or paths) ---
// Using placeholder service, replace with your actual images later
const defaultMoodImages = {
	"😊": HappyIMG,
	"😔": SadIMG,
	"😠": AngryIMG,
	"😢": TearfulIMG,
	"😄": JoyfulIMG,
	default: "../../assets/bgtheme/resj-logo.png",
};
// -----------------------------------------------------------------

const ViewJournal = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [journalEntries, setJournalEntries] = useState([]);
	const [error, setError] = useState(null); // State to store fetch errors
	const navigate = useNavigate(); // Hook for navigation

	// --- Filter State ---
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [selectedMood, setSelectedMood] = useState("");
	const [onlyWithGoal, setOnlyWithGoal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	// --------------------

	// --- Pagination State ---
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20;
	// -----------------------

	const moodOptions = [
		{ value: "😊", label: "😊 Happy" },
		{ value: "😔", label: "😔 Sad" },
		{ value: "😠", label: "😠 Angry" },
		{ value: "😢", label: "😢 Tearful" },
		{ value: "😄", label: "😄 Joyful" },
		// Add other moods as needed
	];

	// --- Fetch Journal Data ---
	useEffect(() => {
		const fetchEntries = async () => {
			setIsLoading(true);
			setError(null); // Reset error before fetch
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/alljournal`,
					{
						withCredentials: true, // IMPORTANT: Send cookies
					}
				);
				// Ensure dates are Date objects if needed later, or just use strings
				// Sort locally just in case backend didn't (though it should)
				const sortedEntries = response.data.sort(
					(a, b) => new Date(b.date) - new Date(a.date)
				);
				setJournalEntries(sortedEntries);
			} catch (err) {
				console.error("Error fetching journal entries:", err);
				if (err.response && err.response.status === 401) {
					// If unauthorized (e.g., invalid cookie), redirect to login
					setError("Authentication failed. Please log in again.");
					// Optional: Redirect after a delay or directly
					// setTimeout(() => navigate('/login'), 2000); // Example redirect
				} else {
					setError("Failed to load journal entries. Please try again later.");
				}
				setJournalEntries([]); // Clear entries on error
			} finally {
				setIsLoading(false);
			}
		};

		fetchEntries();
		// No dependencies needed if it should only run once on mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Empty dependency array means run once on mount
	// -------------------------

	const getFilteredEntries = useCallback(() => {
		// Keep the existing filter logic, operating on the fetched journalEntries
		return journalEntries.filter((entry) => {
			// --- Date Comparison Logic ---
			// Ensure entry.date is comparable. Assuming it's a string like 'YYYY-MM-DD'
			let entryDateComparable = null;
			try {
				// Attempt to create a date object, handle potential invalid formats
				const parts = entry.date.split("-");
				if (parts.length === 3) {
					// Basic check for YYYY-MM-DD format
					entryDateComparable = new Date(
						parseInt(parts[0]),
						parseInt(parts[1]) - 1, // Month is 0-indexed
						parseInt(parts[2])
					);
					entryDateComparable.setHours(0, 0, 0, 0); // Normalize time
				}
			} catch (e) {
				console.warn("Invalid date format for entry:", entry.id, entry.date);
				return false; // Skip entries with invalid dates if filtering by date
			}

			// If date parsing failed and date filters are active, exclude the entry
			if (!entryDateComparable && (startDate || endDate)) {
				return false;
			}

			if (startDate) {
				const compareStartDate = new Date(startDate);
				compareStartDate.setHours(0, 0, 0, 0);
				if (entryDateComparable && entryDateComparable < compareStartDate)
					return false;
			}
			if (endDate) {
				const compareEndDate = new Date(endDate);
				compareEndDate.setHours(0, 0, 0, 0);
				if (entryDateComparable && entryDateComparable > compareEndDate)
					return false;
			}
			// --- End Date Comparison ---

			if (selectedMood && entry.mood !== selectedMood) {
				return false;
			}
			if (onlyWithGoal && !entry.goal) {
				return false;
			}
			const lowerSearch = searchTerm.toLowerCase();
			if (
				searchTerm && // Ensure searchTerm exists
				entry.title && // Check if title exists
				!entry.title.toLowerCase().includes(lowerSearch) &&
				entry.body && // Check if body exists
				!entry.body.toLowerCase().includes(lowerSearch)
			) {
				return false;
			}
			return true;
		});
	}, [
		journalEntries, // Depend on the fetched entries
		startDate,
		endDate,
		selectedMood,
		onlyWithGoal,
		searchTerm,
	]);

	const filteredEntriesResult = getFilteredEntries();
	const totalItems = filteredEntriesResult.length;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentEntries = filteredEntriesResult.slice(startIndex, endIndex);

	// Reset page to 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [startDate, endDate, selectedMood, onlyWithGoal, searchTerm]);

	const resetFilters = () => {
		setStartDate("");
		setEndDate("");
		setSelectedMood("");
		setOnlyWithGoal(false);
		setSearchTerm("");
		setIsFilterOpen(false); // Optionally close filter panel on reset
	};

	// --- Helper Components (InputLabel, inputClasses, LoadingCard) remain the same ---
	const InputLabel = ({ htmlFor, children }) => (
		<label
			htmlFor={htmlFor}
			className="block text-sm font-medium text-white mb-1"
		>
			{children}
		</label>
	);

	const inputClasses =
		"block w-full rounded-md border-gray-300 shadow-sm focus:border-brandGreen-500 focus:ring-brandGreen-500 sm:text-sm p-2 bg-white disabled:bg-gray-100 transition duration-150 ease-in-out text-gray-800"; // Added text-gray-800

	const LoadingCard = () => (
		<div
			className="relative bg-gray-200 rounded-xl shadow-md overflow-hidden border border-gray-300 block animate-pulse"
			style={{ aspectRatio: "9/16" }}
		>
			{/* Simplified loading state */}
			<div className="w-full h-full bg-gray-300"></div>
		</div>
	);
	// -------------------------------------------------------------------------

	return (
		<div className="min-h-screen bg-gradient-to-b from-brandGreen-50 via-brandGreen-100 to-brandGreen-200 py-10 rounded-xl shadow-lg border border-gray-200">
			<div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-4xl font-bold text-center mb-6 text-brandGreen-800">
					Journal Entries
				</h1>

				{/* Error Display Area */}
				{error && (
					<div
						className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
						role="alert"
					>
						<strong className="font-bold">Error: </strong>
						<span className="block sm:inline">{error}</span>
					</div>
				)}

				{/* Filter Toggle Button */}
				<div className="mb-4 flex justify-end">
					<button
						onClick={() => setIsFilterOpen(!isFilterOpen)}
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brandGreen-600 hover:bg-brandGreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandGreen-500 disabled:opacity-50 transition duration-150 ease-in-out"
						// Disable button while loading initial data
						disabled={isLoading && journalEntries.length === 0}
						aria-controls="filter-panel"
						aria-expanded={isFilterOpen}
					>
						<FiFilter className="mr-2 h-4 w-4" />
						{isFilterOpen ? "Hide Filters" : "Show Filters"}
						{isFilterOpen ? (
							<AiOutlineUp className="ml-2 h-4 w-4" />
						) : (
							<AiOutlineDown className="ml-2 h-4 w-4" />
						)}
					</button>
				</div>

				{/* Collapsible Filter Panel */}
				<div
					id="filter-panel"
					className={`transition-all duration-300 ease-in-out overflow-hidden ${
						isFilterOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
					}`}
				>
					<div className="bg-brandGreen-500 p-6 rounded-lg shadow-lg mb-10 border border-brandGreen-200">
						<h2 className="text-xl font-semibold text-white mb-4">
							Filter Options
						</h2>
						{/* Filter Controls Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-end">
							{/* Start Date */}
							<div>
								<InputLabel htmlFor="startDate">Start Date</InputLabel>
								<input
									type="date"
									id="startDate"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									className={inputClasses}
									// Disable filters while loading initial data
									disabled={isLoading && journalEntries.length === 0}
									max={endDate || undefined} // Prevent start date being after end date
								/>
							</div>

							{/* End Date */}
							<div>
								<InputLabel htmlFor="endDate">End Date</InputLabel>
								<input
									type="date"
									id="endDate"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									className={inputClasses}
									disabled={isLoading && journalEntries.length === 0}
									min={startDate || undefined} // Prevent end date being before start date
								/>
							</div>

							{/* Mood Selector */}
							<div>
								<InputLabel htmlFor="moodSelect">Mood</InputLabel>
								<select
									id="moodSelect"
									value={selectedMood}
									onChange={(e) => setSelectedMood(e.target.value)}
									className={inputClasses}
									disabled={isLoading && journalEntries.length === 0}
								>
									<option value="">All Moods</option>
									{moodOptions.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>

							{/* Search Box */}
							{/* Adjusted span for better alignment */}
							<div className="sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1">
								<InputLabel htmlFor="searchBox">Search</InputLabel>
								<div className="relative">
									<input
										type="text"
										id="searchBox"
										placeholder="Search title or body..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className={`${inputClasses} pr-10`}
										disabled={isLoading && journalEntries.length === 0}
									/>
									<AiOutlineSearch
										size={20}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" // Added pointer-events-none
									/>
								</div>
							</div>

							{/* Actions column (Checkbox + Clear Button) */}
							{/* Adjusted layout for better alignment */}
							<div className="flex flex-col items-start space-y-3 sm:flex-row sm:items-end sm:space-y-0 sm:space-x-4">
								{/* Only with Goal Checkbox */}
								<div className="flex items-center pt-1 sm:pt-0">
									{" "}
									{/* Added padding top */}
									<input
										type="checkbox"
										checked={onlyWithGoal}
										onChange={(e) => setOnlyWithGoal(e.target.checked)}
										id="goalCheckbox"
										className="h-4 w-4 text-brandGreen-600 focus:ring-brandGreen-500 border-gray-300 rounded disabled:opacity-50 transition"
										disabled={isLoading && journalEntries.length === 0}
									/>
									<label
										htmlFor="goalCheckbox"
										className="ml-2 text-sm text-white whitespace-nowrap select-none"
									>
										Has Goal
									</label>
								</div>

								{/* Clear Filters Button */}
								<button
									onClick={resetFilters}
									className="flex items-center justify-center px-3 py-2 bg-brandGreen-100 text-brandGreen-700 hover:bg-brandGreen-200 rounded-md text-sm font-medium transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 w-full sm:w-auto" // Full width on small screens
									disabled={
										(isLoading && journalEntries.length === 0) || // Disable while loading initial data
										(!startDate && // Disable if no filters are active
											!endDate &&
											!selectedMood &&
											!onlyWithGoal &&
											!searchTerm)
									}
									title="Clear all filters"
								>
									<AiOutlineClear className="mr-1 h-4 w-4" />
									Clear
								</button>
							</div>
						</div>
					</div>
				</div>
				{/* ----------------------------- */}

				{/* Journal Entries Grid or Loading/Empty State */}
				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
						{[...Array(itemsPerPage)].map((_, index) => (
							<LoadingCard key={index} />
						))}
					</div>
				) : (
					<>
						{currentEntries.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
								{currentEntries.map((entry) => {
									// --- Determine Image Source ---
									let imageUrl = defaultMoodImages.default; // Fallback default
									if (entry.media && entry.media.length > 0) {
										// Find the first image media if available
										const imageMedia = entry.media.find((m) =>
											m.mediatype?.startsWith("image/")
										);
										if (imageMedia) {
											imageUrl = imageMedia.mediaurl;
										} else {
											// Optional: if no image but other media exists, still use mood default
											imageUrl =
												defaultMoodImages[entry.mood] ||
												defaultMoodImages.default;
										}
									} else {
										// No media attached, use mood default
										imageUrl =
											defaultMoodImages[entry.mood] ||
											defaultMoodImages.default;
									}
									// -----------------------------

									return (
										<Link
											to={`/journal/view/${entry.id}`}
											key={entry.id}
											className="relative bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden border border-gray-200 block group transition-transform duration-300 ease-in-out hover:scale-[1.03]"
											style={{ aspectRatio: "9/16" }}
										>
											<img
												src={imageUrl} // Use the determined image URL
												alt={entry.title || "Journal Entry"} // Add alt text
												className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
												loading="lazy"
												// Optional: Add error handling for image load
												onError={(e) => {
													e.target.onerror = null; // Prevent infinite loop
													e.target.src = defaultMoodImages.default; // Fallback image on error
												}}
											/>
											{/* Gradient Overlay */}
											<div
												className="absolute inset-x-0 bottom-0"
												style={{
													top: "60%",
													background:
														"linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.85))",
													pointerEvents: "none",
												}}
											/>
											{/* Text Content */}
											<div
												className="absolute inset-0 p-3 flex flex-col justify-end"
												style={{ top: "60%" }}
											>
												<div className="flex justify-between items-start mb-1">
													<h2 className="text-lg font-semibold text-white drop-shadow-sm leading-tight">
														{entry.title}
													</h2>
													{entry.mood && ( // Only display mood if it exists
														<span
															className="text-3xl ml-2 flex-shrink-0"
															style={{
																filter:
																	"drop-shadow(0 1px 1px rgba(0,0,0,0.5))",
															}}
															aria-label={`Mood: ${entry.mood}`} // Accessibility
														>
															{entry.mood}
														</span>
													)}
												</div>
												{entry.body && ( // Only display body if it exists
													<p className="text-xs text-gray-100 line-clamp-2 overflow-hidden mb-2 drop-shadow-sm">
														{entry.body}
													</p>
												)}
												<div className="flex justify-end mt-auto">
													{entry.date && ( // Only display date if it exists
														<p className="text-xs text-gray-200 drop-shadow-sm">
															{new Date(entry.date).toLocaleDateString(
																"en-US",
																{
																	year: "numeric",
																	month: "short",
																	day: "numeric",
																	timeZone: "UTC", // Specify UTC if date strings don't have timezone info
																}
															)}
														</p>
													)}
												</div>
											</div>
										</Link>
									);
								})}
							</div>
						) : (
							// Display message when filtering results in no entries
							<div className="text-center py-16 bg-white rounded-lg shadow border border-gray-200">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="mx-auto h-12 w-12 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={1.5} // Thinner stroke
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9.75h.008v.008H9V9.75Zm6 0h.008v.008H15V9.75Z"
									/>{" "}
									{/* Updated icon */}
								</svg>

								<h3 className="mt-2 text-lg font-medium text-gray-800">
									{journalEntries.length === 0
										? "No journal entries yet" // Message if fetch returned nothing
										: "No matching entries found"}{" "}
									{/* Message if filters match nothing */}
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									{journalEntries.length === 0
										? "Start writing to see your entries here!"
										: "Try adjusting your filters or clearing them."}
								</p>
								{/* Show Clear Filters button only if filters are active and resulted in empty */}
								{journalEntries.length > 0 &&
									(startDate ||
										endDate ||
										selectedMood ||
										onlyWithGoal ||
										searchTerm) && (
										<div className="mt-6">
											<button
												onClick={resetFilters}
												className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brandGreen-600 hover:bg-brandGreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandGreen-500"
											>
												<AiOutlineClear className="mr-1 h-4 w-4" />
												Clear Filters
											</button>
										</div>
									)}
								{/* Optional: Add button to create new entry if list is completely empty */}
								{journalEntries.length === 0 && !isLoading && (
									<div className="mt-6">
										<Link
											to="/journal/new" // Adjust link as needed
											className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brandGreen-600 hover:bg-brandGreen-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brandGreen-500"
										>
											Create First Entry
										</Link>
									</div>
								)}
							</div>
						)}

						{/* Render Pagination Component (Only if needed) */}
						{totalPages > 1 && (
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default ViewJournal;
