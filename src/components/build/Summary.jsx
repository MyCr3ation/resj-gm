import React from "react";
import useStore from "../../store/store.jsx";
import { cn } from "../../utils/helpers.jsx";

const Summary = () => {
	const { store, setStore } = useStore();
	const { summary } = store;

	const handleChange = (e) => {
		setStore("summary", e.target.value);
	};

	return (
		<div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
			<h2 className="text-2xl font-semibold mb-6">Professional Summary</h2>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Write a brief summary of your professional background and goals
				</label>
				<textarea
					value={summary}
					onChange={handleChange}
					placeholder="e.g. Dedicated web developer with 5+ years of experience in building responsive and user-friendly websites..."
					rows={6}
					className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
				/>

				<div className="mt-4 text-gray-600 text-sm">
					<p>Tips for writing an effective summary:</p>
					<ul className="list-disc ml-5 space-y-1">
						<li>Keep it concise (3-5 sentences)</li>
						<li>Highlight your most relevant skills and experience</li>
						<li>Tailor it to the job you're applying for</li>
						<li>Include quantifiable achievements when possible</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Summary;
