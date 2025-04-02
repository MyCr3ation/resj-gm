import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import SectionTitle from "../common/SectionTitle";
import useStore from "../../store/store.jsx"; // <-- Added import

const Weather = ({ userLocation }) => {
	const [temperatureF, setTemperatureF] = useState(null);
	const [temperatureC, setTemperatureC] = useState(null);
	const [weatherLocation, setWeatherLocation] = useState(null);
	const [error, setError] = useState(null);
	const [unit, setUnit] = useState("F");
	const setStore = useStore((state) => state.setStore); // <-- Get setStore

	useEffect(() => {
		const fetchWeather = async () => {
			if (!userLocation) return;

			try {
				const response = await fetch(
					`http://localhost:5500/api/weather?location=${encodeURIComponent(
						userLocation
					)}`
				);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const data = await response.json();
				if (data && data.days && data.days.length > 0) {
					const tempF = data.days[0].temp;
					const tempC = convertFtoC(tempF);
					const condition = data.days[0].conditions;
					setTemperatureF(tempF);
					setTemperatureC(tempC);
					setWeatherLocation(data.resolvedAddress);
					// Update the global journal store with weather data.
					setStore("journal.temperaturef", tempF);
					setStore("journal.temperaturec", tempC);
					setStore("journal.condition", condition);
				} else {
					setError("No weather data available for your location.");
				}
			} catch (err) {
				console.error("Error fetching weather:", err);
				setError(err.message || "Failed to fetch weather data. Check network.");
			}
		};

		fetchWeather();
	}, [userLocation, setStore]);

	const convertFtoC = (fahrenheit) => {
		return ((fahrenheit - 32) * 5) / 9;
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
								? `${temperatureF.toFixed(1)}°F`
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
