// Menu.jsx
import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import Button from "@/components/common/Button"; // Use the redesigned button
import { cn } from "@/utils/helpers";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

// Styled Content Component
const DropdownMenuContent = React.forwardRef(
	({ className, sideOffset = 4, ...props }, ref) => (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content
				ref={ref}
				sideOffset={sideOffset}
				className={cn(
					// Base styles for the dropdown panel
					"z-50 min-w-[14rem] overflow-hidden rounded-md border border-zinc-700 bg-zinc-800 p-1 text-zinc-100 shadow-md",
					// Animation (optional, requires tailwindcss-animate)
					"data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
					"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
					"data-[side=bottom]:slide-in-from-top-2",
					"data-[side=left]:slide-in-from-right-2",
					"data-[side=right]:slide-in-from-left-2",
					"data-[side=top]:slide-in-from-bottom-2",
					className
				)}
				{...props}
			/>
		</DropdownMenuPrimitive.Portal>
	)
);
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

// Styled Item Component (base for items within MainMenu, etc.)
// This can be exported and used directly in components like MainMenu
const DropdownMenuItem = React.forwardRef(
	({ className, inset, ...props }, ref) => (
		<DropdownMenuPrimitive.Item
			ref={ref}
			className={cn(
				// Base styles for items
				"relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors",
				// Hover/Focus styles
				"focus:bg-zinc-700 focus:text-zinc-50 data-[highlighted]:bg-zinc-700 data-[highlighted]:text-zinc-50", // Use data-highlighted for keyboard nav
				// Disabled styles
				"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
				// Inset style (for icons maybe)
				inset && "pl-8",
				className
			)}
			{...props}
		/>
	)
);
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

// Styled Separator
const DropdownMenuSeparator = React.forwardRef(
	({ className, ...props }, ref) => (
		<DropdownMenuPrimitive.Separator
			ref={ref}
			className={cn("-mx-1 my-1 h-px bg-zinc-700", className)}
			{...props}
		/>
	)
);
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

// The main Menu wrapper component
const Menu = ({
	label,
	icon,
	children,
	className,
	buttonVariant = "default",
	buttonSize = "sm",
}) => {
	return (
		<DropdownMenu>
			{/* The button that triggers the dropdown */}
			<DropdownMenuTrigger asChild className={cn(className)}>
				<Button variant={buttonVariant} size={buttonSize}>
					{/* Content of the trigger button */}
					{label}
					{icon && <span className="ml-1.5">{icon}</span>}{" "}
					{/* Add spacing for icon */}
				</Button>
			</DropdownMenuTrigger>

			{/* The dropdown panel itself */}
			<DropdownMenuContent className="w-56">
				{" "}
				{/* Set width or adjust as needed */}
				{children}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

// Export item components for use in child menus like MainMenu
export {
	Menu,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuContent,
};
// Export the root as well if needed for more complex compositions
export default DropdownMenu;
