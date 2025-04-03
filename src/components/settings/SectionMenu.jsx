// SectionMenu.jsx (Corrected)
import React from "react";
import { useTranslations } from "next-intl";
import useTemplateStore from "@/store/template";
import Button from "@/components/common/Button";
import { MdKeyboardArrowLeft, MdInsertEmoticon } from "react-icons/md";
import { FaAlignCenter, FaAlignLeft, FaAlignRight } from "react-icons/fa"; // Removed FaCheck unless needed
import { BiText } from "react-icons/bi";
import { cn } from "@/utils/helpers";

// Assume Select component is imported or defined (using the same style as in FontMenu)
const Select = React.forwardRef(({ className, children, ...props }, ref) => {
	return (
		<select
			className={cn(
				"flex h-9 max-w-[50%] items-center justify-between rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 ring-offset-back placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brandGreen-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
				"appearance-none bg-arrow-down bg-no-repeat bg-[center_right_0.5rem] bg-[length:1em_1em]",
				"text-right truncate",
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

// Helper component for cleaner button groups
const SettingButtonGroup = ({ children }) => (
	<div className="flex items-center gap-1.5 rounded-md bg-zinc-700/50 p-1">
		{children}
	</div>
);

const SettingButton = ({ onClick, isActive, children, ...props }) => (
	<Button
		type="button"
		onClick={onClick}
		variant="ghost" // Use ghost for subtle buttons in the group
		size="sm" // Use small size for compact buttons
		className={cn(
			"h-7 px-2 text-xs", // Adjust padding and height
			isActive
				? "bg-brand text-white hover:bg-brand/90"
				: "text-zinc-300 hover:bg-zinc-600 hover:text-zinc-100"
		)}
		{...props}
	>
		{children}
	</Button>
);

const SectionMenu = ({ setTabMenu, reset, templateNumber }) => {
	const t = useTranslations("Template");
	// --- FIX: Get the whole template object ---
	const { template, setTemplate } = useTemplateStore();
	// --- End FIX ---

	// Options definition (keep as is)
	const ImageSizeOptions = [
		{ value: "", label: "80x80 (default)" },
		{ value: "60", label: "60x60" },
		{ value: "100", label: "100x100" },
	];
	const spaceOptions = [
		{ value: "", label: t("default") },
		{ value: "less", label: t("less") },
		{ value: "more", label: t("more") },
	];
	const alignOptions = [
		{ value: "left", icon: <FaAlignLeft size={14} />, label: t("alignLeft") },
		{ value: "", icon: <FaAlignCenter size={14} />, label: t("alignCenter") },
		{
			value: "right",
			icon: <FaAlignRight size={14} />,
			label: t("alignRight"),
		},
	];
	const caseOptions = [
		{ value: "normal", icon: "Aa", label: t("caseNormal") },
		{ value: "upper", icon: "AA", label: t("caseUpper") },
		{ value: "lower", icon: "aa", label: t("caseLower") },
	];
	const projectLinkOptions = [
		{ value: "", icon: <BiText size={16} />, label: t("displayText") },
		{
			value: "icon",
			icon: <MdInsertEmoticon size={16} />,
			label: t("displayIcon"),
		},
	];

	// Filter align options (keep as is)
	const alignExisting = [1];
	const filteredAlignOptions = alignExisting.includes(templateNumber)
		? alignOptions
		: alignOptions.filter((e) => e.value !== "");

	// Helper for rendering select-based settings
	const SelectSetting = (
		{ label, stateName, options } // Removed defaultValueLabel - wasn't used
	) => (
		<div className="flex items-center justify-between px-2 py-2.5 rounded-md hover:bg-zinc-700/50">
			<label htmlFor={`select-${stateName}`} className="text-sm text-zinc-300">
				{label}
			</label>
			<Select
				id={`select-${stateName}`}
				name={stateName}
				value={template[stateName] || ""} // Now 'template' is defined
				onChange={(e) => setTemplate(stateName, e.target.value)}
				className="text-xs"
			>
				{options.map((option) => (
					<option
						key={option.value}
						value={option.value}
						className="bg-zinc-900 text-zinc-100"
					>
						{option.label}
					</option>
				))}
			</Select>
		</div>
	);

	// Helper for rendering button-group settings
	const ButtonGroupSetting = ({ label, stateName, options, currentValue }) => (
		<div className="flex items-center justify-between px-2 py-2.5 rounded-md hover:bg-zinc-700/50">
			<span className="text-sm text-zinc-300">{label}</span>
			<SettingButtonGroup>
				{options.map((item) => (
					<SettingButton
						key={item.value}
						onClick={() => setTemplate(stateName, item.value)}
						isActive={currentValue === item.value}
						aria-label={item.label}
					>
						{item.icon || item.value}
					</SettingButton>
				))}
			</SettingButtonGroup>
		</div>
	);

	return (
		// --- FIX for Radix Context: Wrap content in fragments or divs, use DropdownMenuItem only for actions ---
		// Assuming this component is rendered inside a Radix DropdownMenuContent
		<>
			<Button /* This button might need to be a DropdownMenuItem if it's the first item */
				variant="ghost"
				size="sm"
				onClick={() => setTabMenu("main")}
				className="justify-start px-2 mb-2 text-zinc-400 hover:text-zinc-100 w-full flex items-center" // Make it look like an item
			>
				<MdKeyboardArrowLeft size={20} className="mr-1" /> {t("back")}
			</Button>

			{/* Settings List - Render divs directly inside the fragment */}
			<div className="flex flex-col gap-0.5">
				<SelectSetting
					label={t("imageSize")}
					stateName="imageSize"
					options={ImageSizeOptions}
				/>
				<SelectSetting
					label={t("space")}
					stateName="spaceBetween"
					options={spaceOptions}
				/>
				<ButtonGroupSetting
					label={t("align")}
					stateName="align"
					options={filteredAlignOptions}
					currentValue={template.align} // Use template.align
				/>
				<ButtonGroupSetting
					label={t("titles")}
					stateName="titleCase"
					options={caseOptions}
					currentValue={template.titleCase} // Use template.titleCase
				/>
				<ButtonGroupSetting
					label={t("project")}
					stateName="projectLink"
					options={projectLinkOptions}
					currentValue={template.projectLink} // Use template.projectLink
				/>
			</div>

			{/* Reset Button - This should likely be a DropdownMenuItem */}
			{/* Wrap in div temporarily if direct Button causes issues, but ideally DropdownMenuItem */}
			<div className="mt-3 px-2">
				<Button /* Consider changing to DropdownMenuItem with destructive styling */
					variant="destructive"
					size="sm"
					onClick={reset}
					className="w-full"
				>
					{t("resetSection")}
				</Button>
			</div>
		</>
		// --- End FIX for Radix Context ---
	);
};

export default SectionMenu;
