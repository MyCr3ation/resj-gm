// Weather.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import SectionTitle from "../common/SectionTitle";

const Weather = ({ userLocation }) => {
	const [temperatureF, setTemperatureF] = useState(null); // Store Fahrenheit
	const [temperatureC, setTemperatureC] = useState(null); // Store Celsius
	const [weatherLocation, setWeatherLocation] = useState(null);
	const [error, setError] = useState(null);
	const [unit, setUnit] = useState("F"); // 'F' for Fahrenheit, 'C' for Celsius

	useEffect(() => {
		const fetchWeather = async () => {
			if (!userLocation) {
				// userLocation = "Dubai";
				return;
			}

			try {
				// Pass userLocation as a query parameter
				const response = await fetch(
					`http://localhost:5500/api/weather?location=${encodeURIComponent(
						userLocation
					)}`
				);
				console.log(userLocation);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const data = await response.json();
				if (data && data.days && data.days.length > 0) {
					const tempF = data.days[0].temp;
					setTemperatureF(tempF);
					setTemperatureC(convertFtoC(tempF)); // Calculate Celsius
					setWeatherLocation(data.resolvedAddress);
					setError(null);
				} else {
					setError("No weather data available for your location.");
				}
			} catch (err) {
				console.error("Error fetching weather:", err);
				setError(err.message || "Failed to fetch weather data. Check network.");
			}
		};

		fetchWeather();
	}, [userLocation]);

	const convertFtoC = (fahrenheit) => {
		return ((fahrenheit - 32) * 5) / 9;
	};

	const convertCtoF = (celsius) => {
		return (celsius * 9) / 5 + 32;
	};

	const toggleUnit = () => {
		setUnit((prevUnit) => (prevUnit === "F" ? "C" : "F"));
	};

	return (
		<div className="bg-white rounded-lg shadow p-5 border border-gray-100 transition-all hover:shadow-md">
			<SectionTitle>Weather</SectionTitle>
			{error ? (
				<p className="text-red-500 text-sm">{error}</p>
			) : (
				<>
					<p className="text-sm">Location: {weatherLocation || "Loading..."}</p>
					<p className="text-sm">
						Temperature:{" "}
						{unit === "F"
							? temperatureF !== null
								? `${temperatureF.toFixed(1)}°F` //toFixed() to keep it neat
								: "Loading..."
							: temperatureC !== null
							? `${temperatureC.toFixed(1)}°C`
							: "Loading..."}
					</p>
					<button
						type="button"
						onClick={toggleUnit}
						className="px-4 py-1 mt-2 bg-brand text-black rounded hover:bg-brandGreen-600 transition-colors"
					>
						Convert to {unit === "F" ? "°C" : "°F"}
					</button>
				</>
			)}
		</div>
	);
};

export default Weather;
