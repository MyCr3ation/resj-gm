// Weather.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Weather = () => {
	const [weatherData, setWeatherData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchWeather = async () => {
			try {
				const apiKey = "<key>"; // Replace with your actual API key
				const city = "Mumbai"; //  Replace this with dynamic location later
				const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?contentType=json&key=${apiKey}`;

				const response = await fetch(url);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();
				setWeatherData(data.days[0]); // Get today's data
			} catch (error) {
				toast.error("Failed to fetch weather data: " + error.message);
				console.error("Error fetching weather:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchWeather();
	}, []);

	return (
		<div>
			{loading ? (
				<p>Loading weather...</p>
			) : weatherData ? (
				<p>Temperature: {weatherData.temp}°F</p>
			) : (
				<p>Weather data unavailable.</p>
			)}
		</div>
	);
};

export default Weather;
