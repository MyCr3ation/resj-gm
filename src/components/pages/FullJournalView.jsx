import React, { useState, useEffect } from "react";
import {
	AiOutlineInfoCircle,
	AiOutlineCloud,
	AiOutlineSmile,
	AiOutlineStar,
	AiOutlineCheckCircle,
} from "react-icons/ai";
import { BsSun, BsFillCloudSunFill, BsChatSquareQuote } from "react-icons/bs";
import DynamicImage from "../common/DynamicImage.jsx";

const FullJournalView = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [journalEntry, setJournalEntry] = useState(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			// Simulate fetching data from a backend
			const sampleData = {
				id: 1,
				date: "2024-07-28",
				mood: "😊",
				title: "A Day of Discovery and Connection",
				body: "Today was more than just fantastic; it was truly transformative.  From the early morning walk in the park, where I felt the cool dew on the grass, to the evening's breathtaking sunset, every moment felt significant. The picnic was delightful – fresh fruit, crusty bread, and sparkling water.  Developing in React brought its own set of challenges and triumphs, pushing me to learn and grow.  Meeting new friends was the highlight;  our conversations flowed effortlessly, sparking ideas and laughter.  It's amazing how quickly you can connect with people who share your passions.  And that sunset... it painted the sky in hues of orange, pink, and purple – a perfect end to a perfect day.  I feel a deep sense of gratitude for the simple joys and the unexpected connections.",
				goal: "Complete the UI for the new feature",
				affirmation:
					"I am resilient, resourceful, and ready to embrace new challenges.",
				reflection: {
					// Changed to an object with question and answer
					question:
						"What was the most impactful moment of the day, and what did it teach you?",
					answer:
						"The most impactful moment was the spontaneous conversation with my new friends.  It reminded me that connection is essential, and that shared experiences, even small ones, can create lasting bonds.  It also made me reflect on how important it is to be open to new experiences and people.",
				},
				grateful:
					"Today, I'm incredibly grateful for the good weather, the delicious food, the inspiring company of new friends, the opportunity to learn and expand my skills, and the sheer beauty of nature.",
				weather: {
					location: "Mumbai",
					temperatureC: 28,
					temperatureF: 82.4,
					condition: "sunny",
				},
				quote: {
					q: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.",
					a: "Helen Keller",
				},
				media: [
					{ type: "image", url: "resj-logo.png", alt: "Park scene" },
					{
						type: "image",
						url: "https://via.placeholder.com/600x400",
						alt: "Placeholder 600x400",
					},
					{
						type: "image",
						url: "https://via.placeholder.com/400x400",
						alt: "Placeholder 400x400",
					},
					{
						type: "video",
						url: "https://www.w3schools.com/html/mov_bbb.mp4",
					},
					{ type: "audio", url: "https://www.w3schools.com/html/horse.mp3" },
				],
			};
			setJournalEntry(sampleData);
			setIsLoading(false);
		}, 2000); // 2 seconds delay

		return () => clearTimeout(timer); // Clean up the timer
	}, []);

	const weatherIcon = (condition) => {
		switch (condition) {
			case "sunny":
				return <BsSun size={24} className="text-yellow-500" />;
			case "cloudy":
				return <AiOutlineCloud size={24} className="text-gray-500" />;
			case "partly-cloudy":
				return <BsFillCloudSunFill size={24} className="text-blue-300" />;
			default:
				return <AiOutlineCloud size={24} className="text-gray-500" />;
		}
	};

	const Shimmer = () => (
		<div className="animate-shimmer">
			<div className="bg-gray-300 h-full w-full"></div>
		</div>
	);

	const LoadingPlaceholder = () => {
		return (
			<div className="min-h-screen bg-gradient-to-br from-brandGreen-100 to-brandGreen-300 p-8">
				<div className="bg-brandGreen-50 rounded-3xl shadow-2xl overflow-hidden w-full p-6 md:p-10">
					{/* Header */}
					<div className="flex items-center justify-between mb-6 border-b border-brandGreen-200 pb-4">
						<div className="w-3/4 h-10 bg-gray-300 rounded-md animate-shimmer"></div>
						<div className="w-12 h-12 bg-gray-300 rounded-full animate-shimmer"></div>
					</div>

					{/* Date */}
					<div className="w-1/2 h-6 bg-gray-300 rounded-md mb-8 animate-shimmer"></div>

					{/* Main Journal Body */}
					<div className="mb-8">
						<div className="h-6 bg-gray-300 rounded-md mb-2 animate-shimmer"></div>
						<div className="h-6 bg-gray-300 rounded-md mb-2 animate-shimmer"></div>
						<div className="h-6 bg-gray-300 rounded-md mb-2 animate-shimmer"></div>
						<div className="h-6 bg-gray-300 rounded-md mb-2 animate-shimmer"></div>
						<div className="h-6 w-1/2 bg-gray-300 rounded-md animate-shimmer"></div>
					</div>

					{/* Sections (Goal, Affirmation, etc.) */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{[1, 2, 3, 4].map((index) => (
							<div
								key={index}
								className="bg-brandGreen-100 p-5 rounded-xl shadow-md"
							>
								<div className="flex items-center mb-3">
									<div className="w-6 h-6 bg-gray-300 rounded-full mr-2 animate-shimmer"></div>
									<div className="w-1/2 h-6 bg-gray-300 rounded-md animate-shimmer"></div>
								</div>
								<div className="h-4 bg-gray-300 rounded-md mt-2 animate-shimmer"></div>
							</div>
						))}
					</div>

					{/* Weather and Quote (Side-by-Side) */}
					<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="bg-brandGreen-100 p-5 rounded-xl shadow-md">
							<div className="flex items-center mb-3">
								<div className="w-6 h-6 bg-gray-300 rounded-full mr-2 animate-shimmer"></div>
								<div className="w-1/4 h-6 bg-gray-300 rounded-md animate-shimmer"></div>
							</div>
							<div className="h-4 bg-gray-300 rounded-md mb-2 animate-shimmer"></div>
							<div className="h-4 w-1/2 bg-gray-300 rounded-md animate-shimmer"></div>
						</div>
						<div className="bg-brandGreen-100 p-5 rounded-xl shadow-md">
							<div className="flex items-center mb-3">
								<div className="w-6 h-6 bg-gray-300 rounded-full mr-2 animate-shimmer"></div>
								<div className="w-1/4 h-6 bg-gray-300 rounded-md animate-shimmer"></div>
							</div>
							<div className="h-4 bg-gray-300 rounded-md mb-2 animate-shimmer"></div>
							<div className="h-4 w-1/2 bg-gray-300 rounded-md animate-shimmer"></div>
						</div>
					</div>

					{/* Media */}
					<div className="mt-8">
						<h3 className="text-2xl font-semibold text-brandGreen-700 mb-4">
							Media
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{[1, 2, 3, 4, 5].map((index) => (
								<div key={index} className="relative group">
									<div className="w-full h-40 bg-gray-300 rounded-lg animate-shimmer"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	};

	if (isLoading) {
		return <LoadingPlaceholder />;
	}

	if (!journalEntry) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-brandGreen-100 to-brandGreen-300 p-8 flex justify-center items-center">
				<p className="text-brandGreen-700 text-xl">No journal entry found.</p>
			</div>
		);
	}

	const formattedDate = new Date(journalEntry.date).toLocaleDateString(
		"en-US",
		{
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		}
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-brandGreen-100 to-brandGreen-300 p-8">
			<div className="bg-brandGreen-50 rounded-3xl shadow-2xl overflow-hidden w-full p-6 md:p-10">
				{/* Header */}
				<div className="flex items-center justify-between mb-6 border-b border-brandGreen-200 pb-4">
					<h1 className="text-4xl font-extrabold text-brandGreen-800 flex items-center">
						{journalEntry.title}
					</h1>
					<div className="text-3xl">{journalEntry.mood}</div>
				</div>

				{/* Date */}
				<p className="text-gray-600 text-lg mb-8">{formattedDate}</p>

				{/* Main Journal Body */}
				{journalEntry.body && (
					<div className="prose prose-brandGreen max-w-none text-brandGreen-700 leading-relaxed mb-8">
						{journalEntry.body}
					</div>
				)}

				{/* Sections (Goal, Affirmation, etc.) */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{[
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
							tooltip: "What did you learn?",
						},
						{
							title: "Reflection",
							content: journalEntry.reflection, // Now an object
							icon: AiOutlineInfoCircle,
							tooltip: "Reflect on the day.",
						},
						{
							title: "Today I am Grateful For",
							content: journalEntry.grateful,
							icon: AiOutlineSmile,
							tooltip: "List things you were grateful",
						},
					].map((section, index) => {
						// Special handling for Reflection
						if (section.title === "Reflection") {
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
									<p className="text-brandGreen-600 font-medium">
										{section.content.question}
									</p>
									<p className="text-brandGreen-600">
										{section.content.answer}
									</p>
								</div>
							);
						}

						// All other sections
						return section.content ? (
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
								<p className="text-brandGreen-600">{section.content}</p>
							</div>
						) : null;
					})}
				</div>

				{/* Weather and Quote (Side-by-Side) */}
				<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Weather */}
					{journalEntry.weather && (
						<div className="bg-brandGreen-100 p-5 rounded-xl shadow-md">
							<h3 className="text-xl font-semibold text-brandGreen-700 mb-3 flex items-center">
								<div className="mr-2">
									{weatherIcon(journalEntry.weather.condition)}
								</div>
								Weather
							</h3>
							<p className="text-brandGreen-600">
								Location: {journalEntry.weather.location}
							</p>
							<p className="text-brandGreen-600">
								Temperature: {journalEntry.weather.temperatureC}°C /{" "}
								{journalEntry.weather.temperatureF}°F
							</p>
						</div>
					)}

					{/* Quote */}
					{journalEntry.quote && (
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
									"{journalEntry.quote.q}" - {journalEntry.quote.a}
								</blockquote>
							</div>
						</div>
					)}
				</div>

				{/* Media */}
				{journalEntry.media && journalEntry.media.length > 0 && (
					<div className="mt-8">
						<h3 className="text-2xl font-semibold text-brandGreen-700 mb-4">
							Media
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{journalEntry.media.map((item, index) => {
								if (item.type === "image") {
									return (
										<div key={index} className="relative group">
											<DynamicImage
												src={item.url}
												alt={item.alt || `Media item ${index + 1}`}
												className="rounded-lg transition-transform duration-300 transform group-hover:scale-105"
											/>
											<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
												<p className="text-white text-center px-4">
													{item.alt}
												</p>
											</div>
										</div>
									);
								} else if (item.type === "video") {
									return (
										<div key={index} className="relative">
											<video controls className="w-full h-auto rounded-lg">
												<source src={item.url} type="video/mp4" />
												Your browser does not support the video tag.
											</video>
										</div>
									);
								} else if (item.type === "audio") {
									return (
										<div key={index} className="bg-gray-100 p-4 rounded-lg">
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
			</div>
		</div>
	);
};

export default FullJournalView;
