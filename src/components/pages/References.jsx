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

	const [show, setShow] = useState(false);

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
		<div className="flex flex-col gap-2 border-b border-dashed border-gray-400">
			<h2
				className="font-bold text-xl text-brand hover:text-brand/80 animation-all mb-4 cursor-pointer flex items-center gap-1"
				onClick={() => setShow(!show)}
			>
				{t("title")}
				<MdPlayArrow
					size={18}
					className={`mt-1 animation-all ${show ? "rotate-90" : ""}`}
				/>
			</h2>
			{show && (
				<>
					{/* Inputs */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<Input
							state={newReference.name}
							setState={(value) =>
								setNewReference({ ...newReference, name: value })
							}
							name={"name"}
							label={t("name") + "*"}
						/>
						<Input
							state={newReference.company}
							setState={(value) =>
								setNewReference({ ...newReference, company: value })
							}
							name={"company"}
							label={t("company") + "*"}
						/>
						<Input
							state={newReference.phone}
							setState={(value) =>
								setNewReference({ ...newReference, phone: value })
							}
							name={"phone"}
							label={t("phone")}
						/>
						<Input
							state={newReference.email}
							setState={(value) =>
								setNewReference({ ...newReference, email: value })
							}
							name={"email"}
							label={t("email")}
						/>
					</div>

					<Button
						onClick={() =>
							editedIndex === null
								? handleAddReference()
								: handleEditReference()
						}
					>
						{t(editedIndex !== null ? "edit" : "add")}
					</Button>
					{editedIndex !== null && (
						<Button onClick={() => handleCloseEdit()}>{t("close")}</Button>
					)}

					{/* List */}
					<div className="my-6">
						{references.length > 0 && (
							<div className="space-y-4 text-white/80">
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
			)}
		</div>
	);
};

export default References;
