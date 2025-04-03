// Settings.jsx
import React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import useStore from "@/store/store";
import Button from "@/components/common/Button"; // <-- Use new Button
import {
	MdKeyboardArrowRight,
	MdOutlineAdd,
	MdOutlineFileDownload, // Changed icon for export
	MdOutlineFileUpload, // Changed icon for import
} from "react-icons/md";
import { TbTrashX } from "react-icons/tb"; // Changed icon for clear

const Settings = ({ setSettingTab }) => {
	const { loadSampleData } = useStore();
	const t = useTranslations("Template");

	//* Reset all data
	const clearResumeData = () => {
		// Confirmation is important for destructive actions
		if (!window.confirm(t("cleanConfirm"))) {
			return;
		}
		try {
			localStorage.removeItem("resume-data");
			// Optionally clear template settings too if needed
			// localStorage.removeItem("template-store");
			toast.success(t("cleanSuccess"));
			setTimeout(() => {
				window.location.reload(); // Reload to reflect cleared state
			}, 500);
		} catch (error) {
			console.error("Error clearing data:", error);
			toast.error(t("cleanError")); // Add translation
		}
	};

	//* Load sample data
	const handleLoadSampleData = async () => {
		try {
			// Confirmation might be good here too, as it overwrites existing data
			if (!window.confirm(t("sampleConfirm"))) {
				// Add translation
				return;
			}
			await loadSampleData();
			toast.success(t("sampleSuccess"));
			// Optionally reload or navigate back
			// setSettingTab("main"); // Or maybe reload to see changes immediately
			setTimeout(() => {
				window.location.reload(); // Reload to apply sample data everywhere
			}, 500);
		} catch (error) {
			console.error("Error loading sample data:", error);
			toast.error(t("sampleError")); // Add translation
		}
	};

	// Reusable component for menu items leading to other tabs
	const SettingsItem = ({ onClick, label, icon }) => (
		<button
			type="button"
			onClick={onClick}
			// Mimic button style but use full width and different hover/layout
			className="flex items-center justify-between w-full px-3 py-2.5 text-left text-sm rounded-md text-zinc-100 hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brandGreen-500 focus-visible:ring-offset-back transition-colors"
		>
			<span className="flex items-center gap-2">
				{icon}
				{label}
			</span>
			<MdKeyboardArrowRight className="text-zinc-400" size={20} />
		</button>
	);

	return (
		// Add padding and gap to the container
		<div className="flex flex-col gap-1 p-2">
			{/* Use SettingsItem for navigation */}
			<SettingsItem
				onClick={() => setSettingTab("export")}
				label={t("jsonExport")}
				icon={<MdOutlineFileDownload size={18} />}
			/>
			<SettingsItem
				onClick={() => setSettingTab("import")}
				label={t("jsonImport")}
				icon={<MdOutlineFileUpload size={18} />}
			/>

			{/* Separator */}
			<hr className="border-zinc-700 my-1" />

			{/* Action Buttons */}
			<SettingsItem
				onClick={handleLoadSampleData}
				label={t("sample")}
				icon={<MdOutlineAdd size={18} />}
			/>
			{/* Clear Button - Use Button component directly for distinct destructive style */}
			<Button
				variant="destructive"
				size="sm"
				onClick={clearResumeData}
				className="w-full justify-start mt-1" // Justify start to align with items above
			>
				<TbTrashX size={18} className="mr-2" />
				{t("clean")}
			</Button>
		</div>
	);
};

export default Settings;
