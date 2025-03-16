//ViewJournal.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link

const ViewJournal = () => {
	const [isLoading, setIsLoading] = useState(true); // Start with loading true
	const [journalEntries, setJournalEntries] = useState([]); // Start with empty array

	useEffect(() => {
		const timer = setTimeout(() => {
			const sampleJournalData = [
				// Moved sample data inside the useEffect
				{
					id: 1,
					date: "2024-07-28",
					mood: "😊",
					title: "A Wonderful Day",
					image: "resj-logo.png",
					body: "Today was a fantastic day! I went to the park, had a picnic, and enjoyed the beautiful weather. I also learned a lot about React development, which was exciting.",
				},
				{
					id: 2,
					date: "2024-07-27",
					mood: "😔",
					title: "A Bit Gloomy",
					image: "resj-logo.png",
					body: "Felt a bit down today. The weather was cloudy, and I didn't get much done. But I watched a good movie, which helped.",
				},
				{
					id: 3,
					date: "2024-07-26",
					mood: "😄",
					title: "Productive Day!",
					image: "resj-logo.png",
					body: "Got so much work done today! Finished a major project milestone and felt very accomplished. Celebrated with a nice dinner.",
				},
				{
					id: 4,
					date: "2024-07-29",
					mood: "😄",
					title: "Another Great Day!",
					image: "resj-logo.png",
					body: "This is a test entry to see how multiple cards look.",
				},
				{
					id: 5,
					date: "2024-07-30",
					mood: "😊",
					title: "Learning More React",
					image: "resj-logo.png",
					body: "Spent the day diving deeper into React hooks and state management.",
				},
				{
					id: 6,
					date: "2024-07-31",
					mood: "😠",
					title: "Frustrating Bug",
					image: "resj-logo.png",
					body: "Encountered a tricky bug in my code.  Took a while to debug, but I learned from it!",
				},
			].sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date (newest first)

			setJournalEntries(sampleJournalData);
			setIsLoading(false);
		}, 2000);
		return () => clearTimeout(timer); // Cleanup on unmount
	}, []);

	const handleCardClick = (entryId) => {
		// Pass entryId
		// In a real app, this click handler would *not* trigger a general page load.
		// Instead, it would likely do nothing here, and the <Link> would handle navigation.
		// The FullJournalView component would handle loading the specific entry.
		// setIsLoading(true);  // Don't setIsLoading here.  Let the FullJournalView component handle loading.
		// Simulate fetching specific entry (this is *not* how you'd do it in a real app)
		// setTimeout(() => {
		// 	setIsLoading(false);
		// }, 1000);
	};

	const LoadingCard = () => (
		<div
			className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 block animate-shimmer"
			style={{ aspectRatio: "9/16" }}
		>
			<div className="absolute inset-0 w-full h-full bg-gray-300"></div>
			<div
				className="absolute inset-x-0"
				style={{
					top: "65%",
					bottom: "0",
					background:
						"linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3))", // Lighter gradient
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
					{/* Render at least 5 loading cards */}
					{[...Array(5)].map((_, index) => (
						<LoadingCard key={index} />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-8">
			{" "}
			{/* Adjusted max-width */}
			<h1 className="text-3xl font-bold text-center mb-8 text-brand">
				All Journal Entries
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{" "}
				{/* Max 5 columns */}
				{journalEntries.map((entry) => (
					<Link
						to={`/journal/view/${entry.id}`} // Link to full view, using ID
						key={entry.id}
						className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 block" // Added block
						style={{ aspectRatio: "9/16" }}
						onClick={() => handleCardClick(entry.id)} // Pass entry ID.  Click handler *shouldn't* trigger a full page reload
					>
						{/* Background image */}
						<img
							src={entry.image}
							alt={entry.title}
							className="absolute inset-0 w-full h-full object-cover"
						/>

						{/* Gradient overlay starting at 65% of card height */}
						<div
							className="absolute inset-x-0"
							style={{
								top: "65%",
								bottom: "0",
								background:
									"linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8))",
							}}
						>
							<div className="p-3 h-full flex flex-col justify-between">
								{/* Top row: Title on left and Mood on right */}
								<div className="flex justify-between items-center">
									<h2 className="text-lg font-semibold text-white">
										{entry.title}
									</h2>
									<span className="text-2xl">{entry.mood}</span>
								</div>
								{/* Body preview */}
								<p className="text-sm text-white line-clamp-2 mt-2">
									{entry.body}
								</p>
								{/* Bottom row: Date on the right */}
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
