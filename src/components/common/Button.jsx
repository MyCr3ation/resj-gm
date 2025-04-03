// Button.jsx
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/utils/helpers";

// Define button variants using CVA, adapted to the provided theme
const buttonVariants = cva(
	// Base styles applied to all variants
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-back transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				// Default style (using zinc, assuming it complements 'back')
				default:
					"bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700 focus-visible:ring-zinc-500",
				// Primary style (using brand color)
				primary:
					"bg-brand text-white hover:bg-brandGreen-600 border border-transparent focus-visible:ring-brandGreen-400", // Use brand color
				// Destructive style (standard red)
				destructive:
					"bg-red-600 text-white hover:bg-red-700 border border-transparent focus-visible:ring-red-500",
				// Outline style (using theme's subtle borders)
				outline:
					"border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-100 focus-visible:ring-zinc-600",
				// Secondary style (subtler gray)
				secondary:
					"bg-zinc-700 text-zinc-100 hover:bg-zinc-600 border border-transparent focus-visible:ring-zinc-500",
				// Ghost style (minimal, hover effect only on dark bg)
				ghost: "hover:bg-zinc-800 text-zinc-100 focus-visible:ring-zinc-600",
				// Link style (using brand color)
				link: "text-brand underline-offset-4 hover:underline focus-visible:ring-brand",
			},
			size: {
				// Default size (using h-9 to match original closer)
				default: "h-9 px-4 py-2", // Adjusted height slightly
				// Small size
				sm: "h-8 rounded-md px-3", // Adjusted height slightly
				// Large size
				lg: "h-11 rounded-md px-8",
				// Icon button size (square)
				icon: "h-9 w-9", // Adjusted height slightly
			},
		},
		// Default variant settings
		defaultVariants: {
			variant: "default",
			size: "default", // Changed default size
		},
	}
);

const Button = React.forwardRef(
	({ className, variant, size, asChild = false, children, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			>
				{/* Keep the inner div for consistent icon spacing if needed */}
				<div className="flex items-center justify-center gap-1.5">
					{" "}
					{/* Slightly reduced gap */}
					{children}
				</div>
			</Comp>
		);
	}
);
Button.displayName = "Button";

export default Button;
export { buttonVariants };
