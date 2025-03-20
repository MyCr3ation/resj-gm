//MoodSelector.jsx
import React from "react";

const MoodSelector = ({ selectedMood, onMoodChange }) => {
	const moods = ["😊", "😔", "😠", "😢", "😄"];

	return (
		<div className="bg-brandGreen-50 rounded-lg p-3 border border-brandGreen-100">
			<div className="flex space-x-2 justify-center md:justify-start">
				{moods.map((mood) => (
					<button
						key={mood}
						type="button"
						className={`text-2xl hover:scale-110 transition-transform ${
							selectedMood === mood ? "scale-125" : "" // Larger if selected
						}`}
						onClick={() => onMoodChange(mood)}
					>
						{mood}
					</button>
				))}
			</div>
		</div>
	);
};

export default MoodSelector;
