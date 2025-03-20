// Quote.jsx

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Quote = () => {
	const [quote, setQuote] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true); // Add a loading state

	useEffect(() => {
		const fetchQuote = async () => {
			setIsLoading(true); // Set loading to true before fetching
			setError(null); // Clear previous errors

			try {
				const response = await fetch("http://localhost:5500/api/quote"); // Use relative path

				if (!response.ok) {
					// throw new Error(`HTTP Error: ${response.status}`); //old way
					throw new Error(`HTTP error! Status: ${response.status}`); //new way, more readable
				}

				const data = await response.json();

				if (data && data.length > 0) {
					setQuote(data[0]); // Correctly access the first quote
				} else {
					// Specific "no quote" message, *after* loading.
					setQuote({ q: "No quote available for today.", a: "Unknown" });
				}
			} catch (error) {
				console.error("Error fetching quote:", error);
				setError(error.message); // Display the actual error message
				setQuote({ q: "Failed to load quote", a: "Error" }); // Consistent error quote
			} finally {
				setIsLoading(false); // Set loading to false after fetching, success or fail
			}
		};

		fetchQuote();
	}, []);

	return (
		<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
			{/*  <SectionTitle>Quote</SectionTitle> -- Assuming SectionTitle is defined elsewhere */}
			<h2 className="text-lg font-semibold mb-2">Quote</h2>{" "}
			{/*  Simpler SectionTitle  */}
			{error && <p className="text-red-500 text-sm">{error}</p>}
			{isLoading ? (
				<p className="text-sm">Loading Quote...</p>
			) : (
				quote && (
					<blockquote className="italic text-sm">
						"{quote.q}" - {quote.a}
					</blockquote>
				)
			)}
		</div>
	);
};
export default Quote;
