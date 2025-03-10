import React, { useState } from "react";
import { FiPlus, FiX, FiArrowUp, FiArrowDown } from "react-icons/fi";
import useStore from "../../store/store.jsx";
import { handleMoveItem } from "../../utils/helpers.jsx";

const Skills = () => {
	const { store, addItem, removeItem, updateOrder } = useStore();
	const { skills } = store;

	const [newSkill, setNewSkill] = useState("");

	const handleAddSkill = (e) => {
		e.preventDefault();
		if (!newSkill.trim()) return;

		addItem("skills", newSkill.trim());
		setNewSkill("");
	};

	const handleRemoveSkill = (index) => {
		removeItem("skills", index);
	};

	const moveSkill = (index, direction) => {
		handleMoveItem(skills, updateOrder, index, direction, "skills");
	};

	return (
		<div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
			<h2 className="text-2xl font-semibold mb-6">Skills</h2>

			<form onSubmit={handleAddSkill} className="mb-6">
				<div className="flex items-center gap-2">
					<input
						type="text"
						value={newSkill}
						onChange={(e) => setNewSkill(e.target.value)}
						placeholder="Add a skill (e.g. JavaScript, Project Management)"
						className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
					/>
					<button
						type="submit"
						className="p-2 bg-main text-white rounded-md hover:bg-opacity-90 transition-all"
					>
						<FiPlus className="text-xl" />
					</button>
				</div>
			</form>

			{skills.length > 0 ? (
				<div className="space-y-2">
					<h3 className="font-medium">Your Skills ({skills.length})</h3>
					<ul className="space-y-2">
						{skills.map((skill, index) => (
							<li
								key={index}
								className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-md border border-gray-100"
							>
								<span className="flex-1">{skill}</span>
								<div className="flex items-center gap-1">
									<button
										onClick={() => moveSkill(index, "up")}
										disabled={index === 0}
										className={`p-1 rounded-md ${
											index === 0 ? "text-gray-300" : "hover:bg-gray-200"
										}`}
									>
										<FiArrowUp />
									</button>
									<button
										onClick={() => moveSkill(index, "down")}
										disabled={index === skills.length - 1}
										className={`p-1 rounded-md ${
											index === skills.length - 1
												? "text-gray-300"
												: "hover:bg-gray-200"
										}`}
									>
										<FiArrowDown />
									</button>
									<button
										onClick={() => handleRemoveSkill(index)}
										className="p-1 text-red-500 hover:bg-red-50 rounded-md"
									>
										<FiX />
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
			) : (
				<p className="text-gray-500 text-center py-4">No skills added yet.</p>
			)}

			<div className="mt-4 text-gray-600 text-sm">
				<p>Tips:</p>
				<ul className="list-disc ml-5 space-y-1">
					<li>Include both technical and soft skills</li>
					<li>Be specific about technologies you know</li>
					<li>List your skills in order of proficiency</li>
				</ul>
			</div>
		</div>
	);
};

export default Skills;
