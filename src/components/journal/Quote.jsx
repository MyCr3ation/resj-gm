// Quote.jsx
import React, { useState, useEffect } from "react";
import useStore from "../../store/store.jsx";

const Quote = () => {
	const [quote, setQuote] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const setStore = useStore((state) => state.setStore);

	useEffect(() => {
		const fetchQuote = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch("http://localhost:5500/api/quote");
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const data = await response.json();
				const fetchedQuote =
					data && data.length > 0
						? data[0]
						: { q: "No quote available for today.", a: "Unknown" };
				setQuote(fetchedQuote);
				// Update the global journal store for the quote.
				setStore("journal.quote", fetchedQuote);
			} catch (error) {
				console.error("Error fetching quote:", error);
				setError(error.message);
				const fallback = { q: "Failed to load quote", a: "Error" };
				setQuote(fallback);
				setStore("journal.quote", fallback);
			} finally {
				setIsLoading(false);
			}
		};

		fetchQuote();
	}, [setStore]);

	return (
		<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
			<h2 className="text-lg font-semibold mb-2">Quote</h2>
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
