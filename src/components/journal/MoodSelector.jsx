//MoodSelector.jsx
import React from "react";

const MoodSelector = ({ selectedMood, onMoodChange }) => {
	const moods = ["😊", "😔", "😠", "😢", "😄"];

	return (
		<div className="flex space-x-2">
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
	);
};

export default MoodSelector;
