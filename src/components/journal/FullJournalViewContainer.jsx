// src/components/journal/FullJournalViewContainer.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FullJournalView from "../pages/FullJournalView.jsx"; // The presentation component

const FullJournalViewContainer = () => {
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
	const [journalEntry, setJournalEntry] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const { journalId } = useParams(); // Get the journalId from the URL
	const navigate = useNavigate();

	useEffect(() => {
		const fetchJournalEntry = async () => {
			if (!journalId) {
				setError("No Journal ID provided.");
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			setError(null);
			setJournalEntry(null); // Reset previous entry

			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/journal/${journalId}`,
					{
						withCredentials: true, // Send cookies for authentication
					}
				);
				setJournalEntry(response.data);
				console.log("Fetched journal entry:", response.data);
			} catch (err) {
				console.error("Error fetching journal entry:", err);
				if (err.response) {
					if (err.response.status === 401 || err.response.status === 403) {
						setError("Unauthorized. Please log in.");
						// Optional: Redirect to login after delay
						// setTimeout(() => navigate('/login'), 2000);
					} else if (err.response.status === 404) {
						setError("Journal entry not found.");
					} else {
						setError(
							`Failed to load entry: ${err.response.data.error || err.message}`
						);
					}
				} else {
					setError(
						"Failed to load journal entry. Network error or server down."
					);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchJournalEntry();
	}, [journalId, navigate]); // Re-fetch if journalId changes

	if (isLoading) {
		// Use the same LoadingPlaceholder logic as in FullJournalView or a dedicated one
		return <LoadingPlaceholder />;
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-brandGreen-100 to-brandGreen-300 p-8 flex justify-center items-center">
				<div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center">
					<p className="font-bold text-lg mb-2">Error</p>
					<p>{error}</p>
					<button
						onClick={() => navigate("/journal")} // Go back to the list
						className="mt-4 px-4 py-2 bg-brandGreen-600 text-white rounded hover:bg-brandGreen-700"
					>
						Back to Journal List
					</button>
				</div>
			</div>
		);
	}

	if (!journalEntry) {
		// This case might be covered by error handling, but good to have a fallback
		return (
			<div className="min-h-screen bg-gradient-to-br from-brandGreen-100 to-brandGreen-300 p-8 flex justify-center items-center">
				<p className="text-brandGreen-700 text-xl">
					Journal entry could not be loaded.
				</p>
			</div>
		);
	}

	// Pass the fetched data to the presentation component
	return <FullJournalView journalEntry={journalEntry} />;
};

// Define or import LoadingPlaceholder if it's not part of FullJournalView
// Example basic placeholder:
const LoadingPlaceholder = () => (
	<div className="min-h-screen bg-gradient-to-br from-brandGreen-100 to-brandGreen-300 p-8 flex justify-center items-center">
		<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brandGreen-500"></div>
		<p className="ml-4 text-brandGreen-700">Loading Journal...</p>
	</div>
);

export default FullJournalViewContainer;
