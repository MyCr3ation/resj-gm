import { useState } from "react";
import useStore from "../../store/store";
import Input from "../common/Input";
import Button from "../common/Button";
import { MdEmail, MdPhone, MdPlayArrow } from "react-icons/md";
// import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import Example from "../shared/Example";
import { handleMoveItem } from "../../utils/helpers";

const References = () => {
	// Simple translation function replacement
	const t = (key) => key;
	const {
		store: { references },
		addItem,
		editItem,
		removeItem,
		updateOrder,
	} = useStore();

	const [newReference, setNewReference] = useState({
		name: "",
		company: "",
		phone: "",
		email: "",
	});

	//* Add
	const handleAddReference = () => {
		if (newReference.name && newReference.company) {
			addItem("references", newReference);
			setNewReference({
				name: "",
				company: "",
				phone: "",
				email: "",
			});
		} else {
			toast.error(t("error"));
		}
	};

	//* Edit
	const [editedIndex, setEditedIndex] = useState(null);
	const handleEditReference = () => {
		try {
			editItem("references", editedIndex, newReference);
			toast.success(t("success"));
			setEditedIndex(null);
			setNewReference({
				name: "",
				company: "",
				phone: "",
				email: "",
			});
		} catch (error) {
			console.error(error);
			toast.error(error);
		}
	};

	const handleChooseReference = (index) => {
		setEditedIndex(index);
		const referenceItem = references[index];
		setNewReference({
			name: referenceItem.name,
			company: referenceItem.company,
			phone: referenceItem.phone,
			email: referenceItem.email,
		});
	};

	const handleCloseEdit = () => {
		setEditedIndex(null);
		setNewReference({
			name: "",
			company: "",
			phone: "",
			email: "",
		});
	};

	//* Remove
	const handleRemoveReference = (index) => {
		removeItem("references", index);
	};

	//* Sort
	const handleMoveReferenceUp = (index) => {
		handleMoveItem(references, updateOrder, index, "up", "references");
	};

	const handleMoveReferenceDown = (index) => {
		handleMoveItem(references, updateOrder, index, "down", "references");
	};

	return (
		<div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
			<h2 className="text-center font-bold text-3xl text-brand mb-4">
				References
			</h2>

			<>
				{/* Inputs */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Input
						state={newReference.name}
						setState={(value) =>
							setNewReference({ ...newReference, name: value })
						}
						name={"name"}
						label={t("Name") + "*"}
					/>
					<Input
						state={newReference.company}
						setState={(value) =>
							setNewReference({ ...newReference, company: value })
						}
						name={"company"}
						label={t("Company") + "*"}
					/>
					<Input
						state={newReference.phone}
						setState={(value) =>
							setNewReference({ ...newReference, phone: value })
						}
						name={"phone"}
						label={t("Phone")}
					/>
					<Input
						state={newReference.email}
						setState={(value) =>
							setNewReference({ ...newReference, email: value })
						}
						name={"email"}
						label={t("Email")}
					/>
				</div>

				<Button
					className="mt-2"
					onClick={() =>
						editedIndex === null ? handleAddReference() : handleEditReference()
					}
				>
					{t(editedIndex !== null ? "Edit" : "Add")}
				</Button>
				{editedIndex !== null && (
					<Button onClick={() => handleCloseEdit()}>{t("Close")}</Button>
				)}

				{/* List */}
				<div className="my-6">
					{references.length > 0 && (
						<div className="space-y-4 text-black/80">
							{references.map((ref, index) => (
								<Example
									key={index}
									index={index}
									remove={handleRemoveReference}
									edit={handleChooseReference}
									down={handleMoveReferenceDown}
									up={handleMoveReferenceUp}
									title={ref.name + " - " + ref.company}
									state={references}
								>
									<p className="flex items-center gap-1">
										<strong className="text-brand">
											<MdPhone />
										</strong>{" "}
										{ref.phone}
									</p>
									<p className="flex items-center gap-1">
										<strong className="text-brand">
											<MdEmail />
										</strong>{" "}
										{ref.email}
									</p>
								</Example>
							))}
						</div>
					)}
				</div>
			</>
		</div>
	);
};

export default References;
