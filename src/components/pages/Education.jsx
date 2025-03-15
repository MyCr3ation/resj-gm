import { useState } from "react";
import useStore from "@/store/store";
import Input from "@/components/common/Input";
import dynamic from "next/dynamic";
import Button from "@/components/common/Button";
import Stepper from "@/components/layout/Stepper";
import toast from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";
import { handleMoveItem, useFormattedTime } from "@/utils/helpers";
import Example from "@/components/shared/Example";
import { LOCALES } from "@/utils/constants";
import { MdDateRange, MdTextFields } from "react-icons/md";
import Editor from "../shared/Editor";
const Education = () => {
	const t = useTranslations("Education");
	const {
		store: { education },
		addItem,
		editItem,
		removeItem,
		updateOrder,
	} = useStore();

	const [newEducation, setNewEducation] = useState({
		institution: "",
		city: "",
		degree: "",
		fieldOfStudy: "",
		startDate: "",
		endDate: "",
		description: "",
	});

	//* Edit state
	const [editedIndex, setEditedIndex] = useState(null);

	const handleAddEducation = () => {
		if (newEducation.institution && newEducation.degree) {
			addItem("education", newEducation);
			setNewEducation({
				institution: "",
				city: "",
				degree: "",
				fieldOfStudy: "",
				startDate: "",
				endDate: "",
				description: "",
			});
		} else {
			toast.error(t("error"));
		}
	};

	const handleEditEducation = () => {
		try {
			editItem("education", editedIndex, newEducation);
			toast.success(t("success"));
			setEditedIndex(null);
			setNewEducation({
				institution: "",
				city: "",
				degree: "",
				fieldOfStudy: "",
				startDate: "",
				endDate: "",
				description: "",
			});
		} catch (error) {
			console.error(error);
			toast.error(error);
		}
	};

	const handleChooseEducation = (index) => {
		setEditedIndex(index);
		const educationItem = education[index];
		setNewEducation({
			institution: educationItem.institution,
			city: educationItem.city,
			degree: educationItem.degree,
			fieldOfStudy: educationItem.fieldOfStudy,
			startDate: educationItem.startDate,
			endDate: educationItem.endDate,
			description: educationItem.description,
		});
		// Temporary solution
		setTimeout(() => {
			setNewEducation({
				institution: educationItem.institution,
				city: educationItem.city,
				degree: educationItem.degree,
				fieldOfStudy: educationItem.fieldOfStudy,
				startDate: educationItem.startDate,
				endDate: educationItem.endDate,
				description: educationItem.description,
			});
		}, [200]);
	};

	const handleCloseEdit = () => {
		setEditedIndex(null);
		setNewEducation({
			institution: "",
			city: "",
			degree: "",
			fieldOfStudy: "",
			startDate: "",
			endDate: "",
			description: "",
		});
	};

	const handleRemoveEducation = (index) => {
		removeItem("education", index);
	};

	//* Sort functions
	const handleMoveEducationUp = (index) => {
		handleMoveItem(education, updateOrder, index, "up", "education");
	};

	const handleMoveEducationDown = (index) => {
		handleMoveItem(education, updateOrder, index, "down", "education");
	};

	//* ISO
	const locale = useLocale();
	const localeIso = LOCALES.find((lang) => lang.value === locale).iso;

	const [text, setText] = useState("");

	return (
		<div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
			<h1 className="text-center font-bold text-3xl text-brand mb-4">
				Education
			</h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Input
					state={newEducation.institution}
					setState={(value) =>
						setNewEducation({ ...newEducation, institution: value })
					}
					name={"institution"}
					label={t("Institution") + "*"}
				/>
				<Input
					state={newEducation.degree}
					setState={(value) =>
						setNewEducation({ ...newEducation, degree: value })
					}
					name={"degree"}
					label={t("Degree") + "*"}
				/>
				<Input
					state={newEducation.fieldOfStudy}
					setState={(value) =>
						setNewEducation({ ...newEducation, fieldOfStudy: value })
					}
					name={"fieldOfStudy"}
					label={t("Field")}
				/>
				<Input
					state={newEducation.city}
					setState={(value) =>
						setNewEducation({ ...newEducation, city: value })
					}
					name={"city"}
					label={t("City")}
				/>
				<Input
					state={newEducation.startDate}
					setState={(value) =>
						setNewEducation({ ...newEducation, startDate: value })
					}
					type="month"
					name={"startDate"}
					label={t("Start Date")}
				/>
				<Input
					state={newEducation.endDate}
					setState={(value) =>
						setNewEducation({ ...newEducation, endDate: value })
					}
					present={true}
					type="month"
					name={"endDate"}
					label={t("End Date")}
				/>
			</div>

			<div className="mt-2">
				{/* <Editor
					value={text}
					onChange={setText}
					editedIndex={editedIndex}
					state={newEducation.description}
					setState={(value) =>
						setNewEducation({ ...newEducation, description: value })
					}
					label={t("Description")}
				/> */}
				<Editor value={text} onChange={setText} label="Description" />
			</div>

			<Button
				onClick={() =>
					editedIndex === null ? handleAddEducation() : handleEditEducation()
				}
			>
				{t(editedIndex !== null ? "Edit" : "Add")}
			</Button>
			{editedIndex !== null && (
				<Button onClick={() => handleCloseEdit()}>{t("Close")}</Button>
			)}

			{/* List */}
			<div className="mt-6">
				{education.length > 0 && (
					<div className="space-y-4 text-black/80">
						{education.map((item, index) => (
							<Example
								key={index}
								index={index}
								remove={handleRemoveEducation}
								edit={handleChooseEducation}
								down={handleMoveEducationDown}
								up={handleMoveEducationUp}
								title={item.institution}
								state={education}
							>
								<p className="flex items-center gap-1">
									<strong className="text-brand">
										<MdTextFields />
									</strong>{" "}
									{item.degree}
									{` - ${item.fieldOfStudy}`}
								</p>
								<p className="flex items-center gap-1">
									<strong className="text-brand">
										<MdDateRange />
									</strong>{" "}
									{useFormattedTime(item.startDate, localeIso)} -{" "}
									{item.endDate
										? useFormattedTime(item.endDate, localeIso)
										: t("Present")}
								</p>
								<div
									className="text-left mt-2 text-sm opacity-80"
									dangerouslySetInnerHTML={{
										__html:
											item?.description !== "<p><br></p>"
												? item.description
												: "",
									}}
								></div>
							</Example>
						))}
					</div>
				)}
			</div>

			{/* <Stepper prev={`/build?step=2`} next={"/build?step=4"} /> */}
		</div>
	);
};

export default Education;
