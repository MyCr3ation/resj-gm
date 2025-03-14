// Quote.jsx

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Quote = () => {
	const [quote, setQuote] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchQuote = async () => {
			try {
				const response = await fetch("https://zenquotes.io/api/today");
				if (!response.ok) {
					if (response.status === 429) {
						// Too Many Requests
						throw new Error("Rate limit exceeded. Please try again later.");
					}
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				if (data && data.length > 0) {
					setQuote({
						text: data[0].q, // Extract 'q'
						author: data[0].a, // Extract 'a'
					});
				} else {
					throw new Error("No quote received from API.");
				}
			} catch (error) {
				toast.error("Failed to fetch quote:" + error.message);
				console.error("Error fetching quote:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchQuote();
	}, []);

	return (
		<div>
			{loading ? (
				<p>Loading quote...</p>
			) : quote ? (
				<>
					<p>"{quote.text}"</p>
					<p>- {quote.author}</p>
				</>
			) : (
				<p>Quote data unavailable.</p>
			)}
		</div>
	);
};

export default Quote;
