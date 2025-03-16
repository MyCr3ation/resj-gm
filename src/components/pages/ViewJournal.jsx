// ViewJournal.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

const ViewJournal = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [journalEntries, setJournalEntries] = useState([]);

	// Filter states
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [selectedMood, setSelectedMood] = useState("");
	const [onlyWithGoal, setOnlyWithGoal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			const sampleJournalData = [
				{
					id: 1,
					date: "2024-07-28",
					mood: "😊",
					title: "A Wonderful Day",
					image: "resj-logo.png",
					body: "Today was a fantastic day! I went to the park, had a picnic, and enjoyed the beautiful weather. I also learned a lot about React development, which was exciting.",
					goal: "Finish React project",
				},
				{
					id: 2,
					date: "2024-07-27",
					mood: "😔",
					title: "A Bit Gloomy",
					image: "resj-logo.png",
					body: "Felt a bit down today. The weather was cloudy, and I didn't get much done. But I watched a good movie, which helped.",
					// no goal
				},
				{
					id: 3,
					date: "2024-07-26",
					mood: "😄",
					title: "Productive Day!",
					image: "resj-logo.png",
					body: "Got so much work done today! Finished a major project milestone and felt very accomplished. Celebrated with a nice dinner.",
					goal: "Gym session in the morning",
				},
				{
					id: 4,
					date: "2024-07-29",
					mood: "😄",
					title: "Another Great Day!",
					image: "resj-logo.png",
					body: "This is a test entry to see how multiple cards look.",
					// no goal
				},
				{
					id: 5,
					date: "2024-07-30",
					mood: "😊",
					title: "Learning More React",
					image: "resj-logo.png",
					body: "Spent the day diving deeper into React hooks and state management.",
					// no goal
				},
				{
					id: 6,
					date: "2024-07-31",
					mood: "😠",
					title: "Frustrating Bug",
					image: "resj-logo.png",
					body: "Encountered a tricky bug in my code. Took a while to debug, but I learned from it!",
					goal: "Finally fix that bug",
				},
			].sort((a, b) => new Date(b.date) - new Date(a.date));

			setJournalEntries(sampleJournalData);
			setIsLoading(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	// Filter logic
	const filteredEntries = journalEntries.filter((entry) => {
		// Date range: if startDate/endDate provided, check entry's date
		if (startDate && new Date(entry.date) < new Date(startDate)) {
			return false;
		}
		if (endDate && new Date(entry.date) > new Date(endDate)) {
			return false;
		}

		// Mood filter
		if (selectedMood && entry.mood !== selectedMood) {
			return false;
		}

		// Only with goal
		if (onlyWithGoal && !entry.goal) {
			return false;
		}

		// Search filter (case-insensitive in title/body)
		const lowerSearch = searchTerm.toLowerCase();
		const inTitle = entry.title.toLowerCase().includes(lowerSearch);
		const inBody = entry.body.toLowerCase().includes(lowerSearch);
		if (searchTerm && !inTitle && !inBody) {
			return false;
		}

		return true;
	});

	const handleCardClick = (entryId) => {
		// In a real app, you'd navigate or handle logic for the clicked entry
	};

	const LoadingCard = () => (
		<div
			className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 block animate-pulse"
			style={{ aspectRatio: "9/16" }}
		>
			<div className="absolute inset-0 w-full h-full bg-gray-300"></div>
			<div
				className="absolute inset-x-0"
				style={{
					top: "65%",
					bottom: "0",
					background:
						"linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3))",
				}}
			>
				<div className="p-3 h-full flex flex-col justify-between">
					<div className="flex justify-between items-center">
						<div className="h-4 w-1/2 bg-gray-200 rounded-md"></div>
						<div className="h-6 w-6 bg-gray-200 rounded-full"></div>
					</div>
					<div className="h-4 w-full bg-gray-200 rounded-md mt-2"></div>
					<div className="h-4 w-full bg-gray-200 rounded-md mt-2"></div>
					<div className="flex justify-end mt-auto">
						<div className="h-3 w-1/4 bg-gray-200 rounded-md"></div>
					</div>
				</div>
			</div>
		</div>
	);

	if (isLoading) {
		return (
			<div className="w-full max-w-7xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-center mb-8 text-brand">
					All Journal Entries
				</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{[...Array(5)].map((_, index) => (
						<LoadingCard key={index} />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-center mb-8 text-brand">
				All Journal Entries
			</h1>

			{/* Filter Panel */}
			<div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-wrap items-center gap-4">
				{/* Date Range: Start */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Start Date
					</label>
					<input
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
					/>
				</div>

				{/* Date Range: End */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						End Date
					</label>
					<input
						type="date"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
					/>
				</div>

				{/* Mood Selector */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Mood
					</label>
					<select
						value={selectedMood}
						onChange={(e) => setSelectedMood(e.target.value)}
						className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
					>
						<option value="">All Moods</option>
						<option value="😊">😊 Happy</option>
						<option value="😔">😔 Sad</option>
						<option value="😠">😠 Angry</option>
						<option value="😢">😢 Tearful</option>
						<option value="😄">😄 Joyful</option>
					</select>
				</div>

				{/* Only with Goal */}
				<div className="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={onlyWithGoal}
						onChange={(e) => setOnlyWithGoal(e.target.checked)}
						id="goalCheckbox"
						className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
					/>
					<label htmlFor="goalCheckbox" className="text-sm text-gray-700">
						Only with goal
					</label>
				</div>

				{/* Search Box */}
				<div className="flex items-center">
					<input
						type="text"
						placeholder="Search..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="p-1 border rounded-md text-sm"
					/>
					<AiOutlineSearch size={20} className="ml-2" />
				</div>
			</div>

			{/* Filtered Journal Entries */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{filteredEntries.map((entry) => (
					<Link
						to={`/journal/view/${entry.id}`}
						key={entry.id}
						className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 block"
						style={{ aspectRatio: "9/16" }}
						onClick={() => handleCardClick(entry.id)}
					>
						{/* Background image */}
						<img
							src={entry.image}
							alt={entry.title}
							className="absolute inset-0 w-full h-full object-cover"
						/>

						{/* Gradient overlay */}
						<div
							className="absolute inset-x-0"
							style={{
								top: "65%",
								bottom: "0",
								background:
									"linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8))",
							}}
						>
							<div className="p-3 pb-0 h-full flex flex-col justify-between">
								{/* Top row: Title & Mood */}
								<div className="flex justify-between items-center">
									<h2 className="text-base font-semibold text-white">
										{entry.title}
									</h2>
									<span className="text-2xl">{entry.mood}</span>
								</div>
								{/* Body preview */}
								<p className="text-xs text-white line-clamp-2 overflow-hidden">
									{entry.body}
								</p>
								{/* Bottom row: Date */}
								<div className="flex justify-end">
									<p className="text-xs text-white">
										{new Date(entry.date).toLocaleDateString("en-US", {
											weekday: "short",
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</p>
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default ViewJournal;
