import { useCallback, useEffect, useState } from "react";
import useStore from "../../store/store";
import Input from "../common/Input";
import Button from "../common/Button";
import { FaPlus, FaCheck, FaTimes } from "react-icons/fa";
// import { useTranslations } from "next-intl";
import Example from "../shared/Example";
import { handleMoveItem } from "../../utils/helpers";
import { MdPlayArrow } from "react-icons/md";

const Interests = () => {
	// Simple translation function replacement
	const t = (key) => key;
	const {
		store: { interests },
		addItem,
		editItem,
		removeItem,
		updateOrder,
	} = useStore();
	const [newInterests, setNewInterests] = useState("");
	const [editedIndex, setEditedIndex] = useState(null);

	const handleAddInterests = () => {
		if (newInterests.trim() !== "") {
			if (editedIndex === null) {
				addItem("interests", newInterests);
			} else {
				editItem("interests", editedIndex, newInterests);
				setEditedIndex(null);
			}
			setNewInterests("");
		}
	};

	const handleEditInterests = (index) => {
		setEditedIndex(index);
		setNewInterests(interests[index]);
	};

	const handleCloseEdit = () => {
		setEditedIndex(null);
		setNewInterests("");
	};

	const handleRemoveInterests = (index) => {
		removeItem("interests", index);
	};

	//* Sort functions
	const handleMoveInterestsUp = (index) => {
		handleMoveItem(interests, updateOrder, index, "up", "interests");
	};

	const handleMoveInterestsDown = (index) => {
		handleMoveItem(interests, updateOrder, index, "down", "interests");
	};

	//* Shortcuts
	const handleKeyPress = useCallback(
		(event) => {
			if (event.key === "Enter" && newInterests.trim() !== "") {
				handleAddInterests();
			}
		},
		[newInterests, handleAddInterests]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyPress);
		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [handleKeyPress]);

	return (
		<div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
			<h1 className="text-center font-bold text-3xl text-brand mb-4">
				Interests
			</h1>
			<>
				<div className="flex justify-between gap-2 mb-4">
					<Input
						state={newInterests}
						setState={setNewInterests}
						name={"interests"}
						label={t(editedIndex === null ? "Add" : "Edit")}
					/>
					<Button onClick={handleAddInterests}>
						{editedIndex === null ? <FaPlus /> : <FaCheck />}
					</Button>
					{editedIndex !== null && (
						<Button onClick={handleCloseEdit} variant="danger">
							<FaTimes />
						</Button>
					)}
				</div>

				<div className="my-6">
					{interests.length > 0 && (
						<div className="space-y-4 text-black/80">
							{interests.map((interests, index) => (
								<Example
									key={index}
									index={index}
									up={handleMoveInterestsUp}
									down={handleMoveInterestsDown}
									remove={handleRemoveInterests}
									edit={handleEditInterests}
									title={interests}
									state={interests}
									cursor={false}
								></Example>
							))}
						</div>
					)}
				</div>
			</>
		</div>
	);
};

export default Interests;
