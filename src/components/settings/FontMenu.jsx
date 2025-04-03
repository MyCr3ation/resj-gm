// FontMenu.jsx
import React from "react";
import { useTranslations } from "next-intl";
import useTemplateStore from "@/store/template";
import { FONTS, uiSans } from "@/utils/constants"; // Assuming uiSans is defined for UI elements
import Button from "@/components/common/Button"; // <-- Use new Button
import { MdKeyboardArrowLeft } from "react-icons/md";
import { cn } from "@/utils/helpers";

// Re-use or import the Select component from MarginMenu/JSONMenu redesign
// Ensure Select component is available here
const Select = React.forwardRef(({ className, children, ...props }, ref) => {
	return (
		<select
			className={cn(
				"flex h-9 max-w-[50%] items-center justify-between rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 ring-offset-back placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brandGreen-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
				// Basic arrow styling
				"appearance-none bg-arrow-down bg-no-repeat bg-[center_right_0.5rem] bg-[length:1em_1em]",
				"text-right truncate", // Align text right, truncate if needed
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

const FontMenu = ({ setTabMenu, reset }) => {
	const t = useTranslations("Template");
	const { template, setTemplate } = useTemplateStore();

	const sizeOptions = [
		{ label: t("default"), value: "" }, // Add default option explicitly
		{ label: t("small"), value: "small" },
		{ label: t("large"), value: "large" },
	];

	// Structure for mapping settings to UI elements
	const fontSettings = [
		{
			label: t("fontFamily"), // Use translation key
			stateName: "fontFamily",
			options: FONTS.map((font) => ({ label: font, value: font })), // Map fonts to label/value
			isFontFamily: true, // Flag to handle font styling in options
			defaultValue: t("default"), // Text for default option
			defaultValueKey: "",
		},
		{
			label: t("h1"),
			stateName: "h1FontSize",
			options: sizeOptions,
			defaultValue: t("default"),
			defaultValueKey: "",
		},
		{
			label: t("h2"),
			stateName: "h2FontSize",
			options: sizeOptions,
			defaultValue: t("default"),
			defaultValueKey: "",
		},
		{
			label: t("h3"),
			stateName: "h3FontSize",
			options: sizeOptions,
			defaultValue: t("default"),
			defaultValueKey: "",
		},
		{
			label: t("text"),
			stateName: "textFontSize",
			options: sizeOptions,
			defaultValue: t("default"),
			defaultValueKey: "",
		},
		{
			label: t("hyperlink"),
			stateName: "hyperLinkFontSize",
			options: sizeOptions,
			defaultValue: t("default"),
			defaultValueKey: "",
		},
		{
			label: t("description"),
			stateName: "descriptionFontSize",
			options: sizeOptions,
			defaultValue: t("default"),
			defaultValueKey: "",
		},
	];

	return (
		<div className="flex flex-col gap-0 p-2">
			{" "}
			{/* Reduced gap for menu items */}
			<Button
				variant="ghost"
				size="sm"
				onClick={() => setTabMenu("main")}
				className="justify-start px-2 mb-2 text-zinc-400 hover:text-zinc-100" // Align left, add margin bottom
			>
				<MdKeyboardArrowLeft size={20} /> {t("back")}
			</Button>
			{/* Font Settings List */}
			<div className="flex flex-col gap-0.5">
				{" "}
				{/* Tighter gap for list */}
				{fontSettings.map((item) => (
					<div
						key={item.stateName}
						className="flex items-center justify-between px-2 py-2.5 rounded-md hover:bg-zinc-700/50" // Add hover effect to row
					>
						<label
							htmlFor={`select-${item.stateName}`}
							className="text-sm text-zinc-300"
						>
							{item.label}
						</label>
						<Select
							id={`select-${item.stateName}`}
							name={item.stateName}
							value={template[item.stateName] || ""} // Ensure controlled component with default value
							title={template[item.stateName] || item.defaultValue} // Tooltip for current value
							onChange={(e) => setTemplate(item.stateName, e.target.value)}
							className="text-xs" // Smaller text for select
						>
							{/* Default Option */}
							<option
								value={item.defaultValueKey}
								style={{ fontFamily: uiSans }} // Use UI font for default option text
								className="bg-zinc-900 text-zinc-400"
							>
								{item.defaultValue}
							</option>
							{/* Other Options */}
							{item.options?.map((option) => (
								<option
									key={option.value}
									value={option.value}
									// Apply font family styling only to the font family select options
									style={{
										fontFamily: item.isFontFamily ? option.value : uiSans,
									}}
									className="bg-zinc-900 text-zinc-100"
								>
									{option.label}
								</option>
							))}
						</Select>
					</div>
				))}
			</div>
			{/* Reset Button */}
			<div className="mt-3 px-2">
				{" "}
				{/* Add margin top before button */}
				<Button
					variant="destructive"
					size="sm"
					onClick={reset}
					className="w-full" // Make button full width
				>
					{t("resetFont")}
				</Button>
			</div>
		</div>
	);
};

export default FontMenu;
