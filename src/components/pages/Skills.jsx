import { useState, useCallback, useEffect } from "react";
import useStore from "../../store/store.jsx";
import {
	FaPlus,
	FaCheck,
	FaTimes,
	FaArrowUp,
	FaArrowDown,
} from "react-icons/fa";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Example from "../../components/shared/Example";
import Stepper from "@/components/layout/Stepper";

const Skills = () => {
	const {
		store: { skills },
		addItem,
		editItem,
		removeItem,
		updateOrder,
	} = useStore();

	const [newSkill, setNewSkill] = useState("");
	const [editedIndex, setEditedIndex] = useState(null);

	const handleAddSkill = () => {
		if (newSkill.trim() !== "") {
			if (editedIndex === null) {
				addItem("skills", newSkill);
			} else {
				editItem("skills", editedIndex, newSkill);
				setEditedIndex(null);
			}
			setNewSkill("");
		}
	};

	const handleEditSkill = (index) => {
		setEditedIndex(index);
		setNewSkill(skills[index]);
	};

	const handleCloseEdit = () => {
		setEditedIndex(null);
		setNewSkill("");
	};

	const handleRemoveSkill = (index) => {
		removeItem("skills", index);
	};

	// Move item up in the list
	const moveUp = (index) => {
		if (index > 0) {
			const newOrder = [...skills];
			const temp = newOrder[index];
			newOrder[index] = newOrder[index - 1];
			newOrder[index - 1] = temp;
			updateOrder("skills", newOrder);
		}
	};

	// Move item down in the list
	const moveDown = (index) => {
		if (index < skills.length - 1) {
			const newOrder = [...skills];
			const temp = newOrder[index];
			newOrder[index] = newOrder[index + 1];
			newOrder[index + 1] = temp;
			updateOrder("skills", newOrder);
		}
	};
	// These functions are now replaced by moveUp and moveDown above

	//* Shortcuts
	const handleKeyPress = useCallback(
		(event) => {
			if (event.key === "Enter" && newSkill.trim() !== "") {
				handleAddSkill();
			}
		},
		[newSkill]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyPress);
		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [handleKeyPress]);

	return (
		<div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
			<h1 className="text-center font-bold text-3xl text-brand mb-4">Skills</h1>
			<div className="flex justify-between gap-2 mb-4">
				<Input
					state={newSkill}
					setState={setNewSkill}
					name={"skill"}
					label={editedIndex === null ? "Add skill" : "Edit skill"}
				/>
				<Button onClick={handleAddSkill}>
					{editedIndex === null ? <FaPlus /> : <FaCheck />}
				</Button>
				{editedIndex !== null && (
					<Button onClick={handleCloseEdit} variant="danger">
						<FaTimes />
					</Button>
				)}
			</div>

			<div className="my-6">
				{skills.length > 0 && (
					<div className="space-y-4 text-black/80">
						{skills.map((skill, index) => (
							<Example
								key={index}
								index={index}
								up={moveUp}
								down={moveDown}
								remove={handleRemoveSkill}
								edit={handleEditSkill}
								title={skill}
								state={skills}
								cursor={false}
							></Example>
						))}
					</div>
				)}
			</div>

			{/* <Stepper prev={`/build?step=4`} next={"/build?step=6"} /> */}
		</div>
	);
};

export default Skills;
