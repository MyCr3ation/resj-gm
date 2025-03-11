import { useState } from "react";
import useStore from "@/store/store";
import Input from "@/components/common/Input";
import dynamic from "next/dynamic";
import Button from "@/components/common/Button";
import { handleMoveItem, useFormattedTime } from "@/utils/helpers";
import Stepper from "@/components/layout/Stepper";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { LOCALES } from "@/utils/constants";
import Example from "@/components/shared/Example";
import { MdDateRange, MdPinDrop } from "react-icons/md";
import EditorLoading from "@/components/shared/EditorLoading";
const Editor = dynamic(() => import("@/components/shared/Editor"), {
	ssr: false,
	loading: () => <EditorLoading />,
});
const Experience = () => {
	const t = useTranslations("Experience");
	const {
		store: { experience },
		addItem,
		editItem,
		removeItem,
		updateOrder,
	} = useStore();

	const [newExperience, setNewExperience] = useState({
		company: "",
		jobTitle: "",
		city: "",
		startDate: "",
		endDate: "",
		description: "",
	});

	const handleAddExperience = () => {
		if (newExperience.company && newExperience.jobTitle) {
			addItem("experience", newExperience);
			setNewExperience({
				company: "",
				jobTitle: "",
				city: "",
				startDate: "",
				endDate: "",
				description: "",
			});
		} else {
			toast.error(t("error"));
		}
	};
	//* Edit
	const [editedIndex, setEditedIndex] = useState(null);
	const handleEditExperience = () => {
		try {
			editItem("experience", editedIndex, newExperience);
			toast.success(t("success"));
			setEditedIndex(null);
			setNewExperience({
				company: "",
				jobTitle: "",
				city: "",
				startDate: "",
				endDate: "",
				description: "",
			});
		} catch (error) {
			console.error(error);
			toast.error(error);
		}
	};

	const handleChooseExperience = (index) => {
		setEditedIndex(index);
		const experienceItem = experience[index];
		setNewExperience({
			company: experienceItem.company,
			jobTitle: experienceItem.jobTitle,
			city: experienceItem.city,
			startDate: experienceItem.startDate,
			endDate: experienceItem.endDate,
			description: experienceItem.description,
		});
		// Temporary solution
		setTimeout(() => {
			setNewExperience({
				company: experienceItem.company,
				jobTitle: experienceItem.jobTitle,
				city: experienceItem.city,
				startDate: experienceItem.startDate,
				endDate: experienceItem.endDate,
				description: experienceItem.description,
			});
		}, [200]);
	};

	const handleCloseEdit = () => {
		setEditedIndex(null);
		setNewExperience({
			company: "",
			jobTitle: "",
			city: "",
			startDate: "",
			endDate: "",
			description: "",
		});
	};

	const handleRemoveExperience = (index) => {
		removeItem("experience", index);
	};

	//* Sort functions
	const handleMoveExperienceUp = (index) => {
		handleMoveItem(experience, updateOrder, index, "up", "experience");
	};

	const handleMoveExperienceDown = (index) => {
		handleMoveItem(experience, updateOrder, index, "down", "experience");
	};

	//* ISO
	const locale = useLocale();
	const localeIso = LOCALES.find((lang) => lang.value === locale).iso;

	return (
		<div className="my-14 lg:my-20 px-10 flex flex-col gap-2">
			<h1 className="text-center font-bold text-3xl text-main mb-4">
				Experience
			</h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Input
					state={newExperience.company}
					setState={(value) =>
						setNewExperience({ ...newExperience, company: value })
					}
					name={"company"}
					label={t("company") + "*"}
				/>
				<Input
					state={newExperience.jobTitle}
					setState={(value) =>
						setNewExperience({ ...newExperience, jobTitle: value })
					}
					name={"jobTitle"}
					label={t("jobtitle") + "*"}
				/>
				<Input
					state={newExperience.city}
					setState={(value) =>
						setNewExperience({ ...newExperience, city: value })
					}
					className={`sm:col-span-2`}
					name={"city"}
					label={t("city")}
				/>{" "}
				<Input
					state={newExperience.startDate}
					setState={(value) =>
						setNewExperience({ ...newExperience, startDate: value })
					}
					type="month"
					name={"startDate"}
					label={t("startDate")}
				/>
				<Input
					state={newExperience.endDate}
					setState={(value) =>
						setNewExperience({ ...newExperience, endDate: value })
					}
					type="month"
					present={true}
					name={"endDate"}
					label={t("endDate")}
				/>
			</div>
			<div className="mt-2">
				<Editor
					state={newExperience.description}
					setState={(value) =>
						setNewExperience({ ...newExperience, description: value })
					}
					label={t("description")}
				/>
			</div>
			<Button
				onClick={() =>
					editedIndex === null ? handleAddExperience() : handleEditExperience()
				}
			>
				{t(editedIndex !== null ? "edit" : "add")}
			</Button>
			{editedIndex !== null && (
				<Button onClick={() => handleCloseEdit()}>{t("close")}</Button>
			)}

			{/* List */}
			<div className="mt-6">
				{experience.length > 0 && (
					<div className="space-y-4 text-white/80">
						{experience.map((exp, index) => (
							<Example
								key={index}
								index={index}
								remove={handleRemoveExperience}
								edit={handleChooseExperience}
								down={handleMoveExperienceDown}
								up={handleMoveExperienceUp}
								title={exp.company + " " + exp.jobTitle}
								state={experience}
							>
								<p className="flex items-center gap-1">
									<strong className="text-main">
										<MdPinDrop />
									</strong>{" "}
									{exp.city}
								</p>
								<p className="flex items-center gap-1">
									<strong className="text-main">
										<MdDateRange />
									</strong>{" "}
									{useFormattedTime(exp.startDate, localeIso)} -{" "}
									{exp.endDate
										? useFormattedTime(exp.endDate, localeIso)
										: t("present")}
								</p>
								<div
									className="text-left mt-2 text-sm opacity-80"
									dangerouslySetInnerHTML={{
										__html:
											exp?.description !== "<p><br></p>" ? exp.description : "",
									}}
								></div>
							</Example>
						))}
					</div>
				)}
			</div>

			<Stepper prev={`/build?step=3`} next={"/build?step=5"} />
		</div>
	);
};

export default Experience;
