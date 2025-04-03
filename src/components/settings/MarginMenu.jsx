// MarginMenu.jsx
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import useTemplateStore from "@/store/template";
import Button from "@/components/common/Button"; // <-- Import new Button
import { MdKeyboardArrowLeft } from "react-icons/md";
import { cn } from "@/utils/helpers";

// Simple Input component for consistency (Optional, but helps)
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
	return (
		<input
			type={type}
			className={cn(
				"flex h-9 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 ring-offset-back file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brandGreen-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				"appearance-none number-input-no-spinners", // Hide number spinners if type="number"
				className
			)}
			ref={ref}
			{...props}
		/>
	);
});
Input.displayName = "Input";

// Simple Select component for consistency (Optional, but helps)
const Select = React.forwardRef(({ className, children, ...props }, ref) => {
	return (
		<select
			className={cn(
				"flex h-9 w-full items-center justify-between rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 ring-offset-back placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brandGreen-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
				// Basic arrow styling (replace with custom icon if needed)
				"appearance-none bg-arrow-down bg-no-repeat bg-[center_right_0.5rem] bg-[length:1em_1em]",
				className
			)}
			ref={ref}
			{...props}
		>
			{children}
		</select>
	);
});
Select.displayName = "Select";

// CSS for hiding number input spinners and adding select arrow (add to global CSS or style tag)
/*
.number-input-no-spinners::-webkit-outer-spin-button,
.number-input-no-spinners::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-input-no-spinners {
  -moz-appearance: textfield; // Firefox
}

.bg-arrow-down {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23a1a1aa'%3e%3cpath fill-rule='evenodd' d='M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z' clip-rule='evenodd' /%3e%3c/svg%3e"); // SVG arrow (zinc-400 color)
}
*/

const MarginMenu = ({ setTabMenu }) => {
	const t = useTranslations();
	const {
		template: { spaceBetween },
	} = useTemplateStore();
	const defaultSpace =
		spaceBetween === "less" ? "8" : spaceBetween === "more" ? "24" : "16";
	const [selectedSectionID, setSelectedSectionID] = useState("");
	const [customMargin, setCustomMargin] = useState(defaultSpace);

	// Define sections directly here or import from a constants file
	const SECTIONS = [
		{ value: "summary", label: t("Personal.summary") },
		{ value: "socials", label: t("Social.title") },
		{ value: "education", label: t("Education.title") },
		{ value: "experience", label: t("Experience.title") },
		{ value: "skills", label: t("Skills.title") },
		{ value: "interests", label: t("Interests.title") },
		{ value: "references", label: t("References.title") },
		{ value: "certificates", label: t("Certificates.title") },
		{ value: "projects", label: t("Projects.title") },
		{ value: "languages", label: t("Languages.title") },
	];

	const addCustomMargin = () => {
		if (selectedSectionID === "" || customMargin.trim() === "") {
			toast.error(t("Template.customError"));
			return;
		}
		try {
			// Assuming template structure prefixes IDs like 'template1-'
			// Make this more robust if template IDs can change
			const elementId = `template1-${selectedSectionID}`;
			const element = document.getElementById(elementId);
			if (element) {
				element.style.marginTop = `${Number(customMargin)}px`;
				toast.success(t("Template.customSuccess"));
			} else {
				// Handle case where element might not be rendered yet or ID is wrong
				console.warn(`Element with ID '${elementId}' not found.`);
				toast.error(t("Template.elementNotFound")); // Add translation for this
			}
		} catch (error) {
			console.error("Error applying custom margin:", error);
			toast.error(t("Template.customApplyError")); // Add translation
		}
	};

	const resetCustomMargins = () => {
		if (!window.confirm(t("Template.customResetConfirm"))) {
			// Add confirmation
			return;
		}
		try {
			// Find all potentially affected elements and reset their margin-top
			SECTIONS.forEach((section) => {
				const elementId = `template1-${section.value}`;
				const element = document.getElementById(elementId);
				if (element && element.style.marginTop) {
					element.style.removeProperty("margin-top");
				}
			});
			// Optionally reset the state if needed
			setSelectedSectionID("");
			setCustomMargin(defaultSpace);
			toast.success(t("Template.customResetSuccess")); // Add translation
			// Note: This doesn't persist. A full reload would also reset styles.
			// Consider storing custom margins in template state for persistence.
		} catch (error) {
			console.error("Error resetting margins:", error);
			toast.error(t("Template.customResetError")); // Add translation
		}
	};

	return (
		<div className="flex flex-col gap-3 p-2">
			{" "}
			{/* Added padding and gap */}
			<Button
				variant="ghost" // Use ghost for back button
				size="sm"
				onClick={() => setTabMenu("main")}
				className="justify-start px-2 text-zinc-400 hover:text-zinc-100" // Align left
			>
				<MdKeyboardArrowLeft size={20} /> {t("Template.back")}
			</Button>
			{/* Section Item */}
			<div className="flex flex-col gap-1.5 px-2">
				<label
					htmlFor="section-margin-select"
					className="text-xs font-medium text-zinc-400"
				>
					{t("Template.section")}
				</label>
				<Select
					id="section-margin-select"
					value={selectedSectionID}
					onChange={(e) => setSelectedSectionID(e.target.value)}
					name="section-margin"
					className="text-sm" // Ensure text size is appropriate
				>
					<option value="" disabled className="text-zinc-500">
						{" "}
						{/* Use disabled and styled */}
						{t("Template.select")}
					</option>
					{SECTIONS.map((item) => (
						<option
							key={item.value}
							value={item.value}
							className="bg-zinc-800 text-zinc-100" // Style options for dark mode
						>
							{item.label}
						</option>
					))}
				</Select>
			</div>
			{/* Margin Input Item */}
			<div className="flex flex-col gap-1.5 px-2">
				<label
					htmlFor="custom-margin-input"
					className="text-xs font-medium text-zinc-400"
				>
					{t("Template.margin")} (px)
				</label>
				<Input
					id="custom-margin-input"
					type="number"
					name="custom-margin-input"
					value={customMargin}
					onChange={(e) => setCustomMargin(e.target.value)}
					placeholder={defaultSpace} // Show default as placeholder
					min="0" // Sensible minimum
				/>
			</div>
			{/* Action Buttons */}
			<div className="mt-2 flex flex-col gap-2 px-2">
				<Button
					variant="primary" // Use primary for the main action
					size="sm"
					onClick={addCustomMargin}
					disabled={!selectedSectionID} // Disable if no section selected
				>
					{t("Template.customAdd")}
				</Button>
				<Button
					variant="destructive" // Use destructive for reset
					size="sm"
					onClick={resetCustomMargins} // Use the improved reset function
				>
					{t("Template.customReset")}
				</Button>
			</div>
		</div>
	);
};

export default MarginMenu;
