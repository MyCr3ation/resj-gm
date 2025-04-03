import React, { useState } from "react";
import useStore from "../../store/store.jsx";
import { cn } from "../../utils/helpers.jsx";
import Editor from "../../components/shared/Editor";

const Summary = () => {
	const { store, setStore } = useStore();
	const { summary } = store;

	const handleChange = (e) => {
		setStore("summary", e.target.value);
	};

	return (
		<div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
			<h1 className="text-center font-bold text-3xl text-brand mb-4">
				Professional Summary
			</h1>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Write a brief summary of your professional background and goals
				</label>
				<Editor
					value={store.summary || ""}
					onChange={(value) => setStore("summary", value)}
					placeholder="e.g. Dedicated web developer with 5+ years of experience in building responsive and user-friendly websites..."
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
