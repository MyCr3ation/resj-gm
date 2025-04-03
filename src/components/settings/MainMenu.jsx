// MainMenu.jsx
import React from "react";
import { useTranslations } from "next-intl";
import useTemplateStore from "@/store/template";
import { MdKeyboardArrowRight } from "react-icons/md";
import {
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/settings/Menu"; // Import styled Radix items
import { cn } from "@/utils/helpers";

// Re-use or import Input component style
const Input = React.forwardRef(({ className, ...props }, ref) => (
	<input
		className={cn(
			"flex h-8 w-full rounded-md border border-zinc-600 bg-zinc-700 px-2 py-1 text-xs text-zinc-100 ring-offset-back placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brandGreen-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
			className
		)}
		ref={ref}
		{...props}
	/>
));
Input.displayName = "Input";

// Component for items that navigate to another menu tab
const MainMenuNavItem = ({ onClick, children }) => (
	<DropdownMenuItem
		onClick={onClick}
		className="flex items-center justify-between" // Ensure space-between layout
	>
		{children}
		<MdKeyboardArrowRight className="ml-2 text-zinc-400" size={18} />
	</DropdownMenuItem>
);

const MainMenu = ({ setTabMenu, setTemplateModal, reset }) => {
	const {
		template: { name },
		setTemplate,
	} = useTemplateStore();
	const t = useTranslations("Template");

	// Prevent dropdown from closing when interacting with the input
	const handleInputInteraction = (e) => {
		e.stopPropagation(); // Stop event bubbling up to the item/content
	};
	const handleInputKeyDown = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.stopPropagation(); // Allow space/enter within input
		}
	};

	return (
		<>
			{/* Change Template */}
			<DropdownMenuItem onClick={() => setTemplateModal(true)}>
				{t("change")}
			</DropdownMenuItem>

			{/* Resume Name Input */}
			{/* Wrap input in a non-interactive div inside an item, or use DropdownMenuLabel */}
			{/* Using a div prevents the item's default close-on-click */}
			<div className="relative flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm outline-none">
				<label
					htmlFor="resume-name-input"
					className="pr-2 flex-shrink-0 text-zinc-300"
				>
					{t("name")}
				</label>
				<Input
					id="resume-name-input"
					type="text"
					name="resume-name"
					value={name || ""} // Ensure controlled input
					onChange={(e) => setTemplate("name", e.target.value)}
					onClick={handleInputInteraction} // Prevent closing on click inside input
					onKeyDown={handleInputKeyDown} // Allow space etc. inside input
					className="h-7 text-xs" // Adjust input size
				/>
			</div>

			{/* Separator */}
			<DropdownMenuSeparator />

			{/* Navigation Items */}
			<MainMenuNavItem onClick={() => setTabMenu("colors")}>
				{t("settingColor")}
			</MainMenuNavItem>
			<MainMenuNavItem onClick={() => setTabMenu("sections")}>
				{t("settingSection")}
			</MainMenuNavItem>
			<MainMenuNavItem onClick={() => setTabMenu("fonts")}>
				{t("settingFont")}
			</MainMenuNavItem>
			<MainMenuNavItem onClick={() => setTabMenu("margin")}>
				{t("custom")}
			</MainMenuNavItem>

			{/* Separator */}
			<DropdownMenuSeparator />

			{/* Reset Button */}
			<DropdownMenuItem
				onClick={reset}
				className="text-red-500 focus:bg-red-900/50 focus:text-red-400 data-[highlighted]:bg-red-900/50 data-[highlighted]:text-red-400" // Destructive styling
			>
				{t("reset")}
			</DropdownMenuItem>
		</>
	);
};

export default MainMenu;
