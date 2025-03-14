import React from "react";

const ViewJournal = () => {
	// Sample journal data, sorted descending by date
	const journalEntries = [
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
	].sort((a, b) => new Date(b.date) - new Date(a.date));

	return (
		<div className="w-full max-w-8xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-center mb-8 text-brand">
				All Journal Entries
			</h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{journalEntries.map((entry) => (
					<div
						key={entry.id}
						className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
						style={{ aspectRatio: "9/16" }}
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
					</div>
				))}
			</div>
		</div>
	);
};

export default ViewJournal;
