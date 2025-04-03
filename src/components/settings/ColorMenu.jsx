// ColorMenu.jsx (Refined for Radix context)
import React from "react";
import { useTranslations } from "next-intl";
import useTemplateStore from "@/store/template";
import ColorPicker from "@/components/shared/ColorPicker";
// Import Radix item and separator for actions
import {
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/settings/Menu";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { cn } from "@/utils/helpers";

const ColorSettingRow = ({ label, stateName, defaultValue }) => {
	const { template, setTemplate } = useTemplateStore();
	const currentColor = template[stateName] || defaultValue;

	// Prevent item click behavior when interacting with color picker
	const handleInteraction = (e) => e.stopPropagation();

	return (
		// Use a standard div for layout, not DropdownMenuItem
		<div
			className="flex items-center justify-between px-3 py-2 text-sm" // Use padding similar to DropdownMenuItem
			onClick={handleInteraction} // Prevent clicks on the row closing the menu if needed
		>
			<label htmlFor={stateName} className="text-zinc-300">
				{" "}
				{/* Use label for accessibility */}
				{label}
			</label>
			<ColorPicker
				id={stateName}
				state={currentColor}
				setState={(value) => setTemplate(stateName, value)}
				onClick={handleInteraction} // Prevent clicks on picker itself closing menu
				onKeyDown={handleInteraction} // Prevent space/enter on picker closing menu
			/>
		</div>
	);
};

const ColorMenu = ({ setTabMenu, reset }) => {
	const t = useTranslations("Template");

	const colorSettings = [
		// ... (same as before)
		{ label: t("h1"), stateName: "h1Color", defaultValue: "#ffffff" },
		{ label: t("h2"), stateName: "h2Color", defaultValue: "#e5e5e5" },
		{ label: t("h3"), stateName: "h3Color", defaultValue: "#d4d4d4" },
		{ label: t("text"), stateName: "textColor", defaultValue: "#a1a1aa" },
		{
			label: t("description"),
			stateName: "descriptionColor",
			defaultValue: "#71717a",
		},
		{
			label: t("hyperlink"),
			stateName: "hyperLinkColor",
			defaultValue: "#38bdf8",
		},
	];

	return (
		<>
			{/* Back Action: Use DropdownMenuItem */}
			<DropdownMenuItem
				onClick={() => setTabMenu("main")}
				className="text-zinc-400 focus:text-zinc-100 data-[highlighted]:text-zinc-100" // Custom styling for back item
			>
				<MdKeyboardArrowLeft size={18} className="mr-1" /> {t("back")}
			</DropdownMenuItem>

			<DropdownMenuSeparator />

			{/* Color Settings List: Render divs directly */}
			<div className="flex flex-col">
				{" "}
				{/* Optional: wrapper div if needed */}
				{colorSettings.map((item) => (
					<ColorSettingRow
						key={item.stateName}
						label={item.label}
						stateName={item.stateName}
						defaultValue={item.defaultValue}
					/>
				))}
			</div>

			<DropdownMenuSeparator />

			{/* Reset Action: Use DropdownMenuItem */}
			<DropdownMenuItem
				onClick={reset}
				className="text-red-500 focus:bg-red-900/50 focus:text-red-400 data-[highlighted]:bg-red-900/50 data-[highlighted]:text-red-400" // Destructive styling
			>
				{t("resetColor")}
			</DropdownMenuItem>
		</>
	);
};

export default ColorMenu;
