// CVPreview.jsx (Corrected Overflow)
"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { PiReadCvLogo } from "react-icons/pi";
import { FiMinimize } from "react-icons/fi";

import TemplateSettings from "@/components/settings/TemplateSettings";
import Loading from "@/components/shared/Loading";
import ChangeTemplate from "@/components/settings/ChangeTemplate";
import Button from "@/components/common/Button";
import useTemplateStore from "@/store/template";
import { cn } from "@/utils/helpers";

// Dynamic Template Imports
const Template1 = dynamic(() => import("@/components/templates/Template1"), {
	ssr: false,
	loading: () => <Loading />,
});
const Template2 = dynamic(() => import("@/components/templates/Template2"), {
	ssr: false,
	loading: () => <Loading />,
});

const CVPreview = () => {
	const { template } = useTemplateStore();
	const [show, setShow] = useState(false);
	const [templateModal, setTemplateModal] = useState(false);

	const openReview = useCallback(() => {
		setShow((prevShow) => {
			const nextShow = !prevShow;
			if (nextShow) {
				document.documentElement.style.overflow = "hidden";
			} else {
				document.documentElement.style.overflow = "unset";
			}
			return nextShow;
		});
	}, []);

	const handleKeyPress = useCallback((event) => {
		if (event.ctrlKey && (event.key === "s" || event.key === "S")) {
			event.preventDefault();
			window.print();
		}
	}, []);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyPress);
		return () => {
			document.removeEventListener("keydown", handleKeyPress);
			document.documentElement.style.overflow = "unset";
		};
	}, [handleKeyPress]);

	return (
		<div>
			{/* FAB (Mobile/Tablet Toggle) - No changes needed here */}
			<Button
				variant="primary"
				size="icon"
				onClick={openReview}
				className={cn(
					"fixed bottom-4 right-4 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg",
					"xl:hidden print:hidden z-50 group/mobile"
				)}
				aria-label={show ? "Minimize Preview" : "Maximize Preview"}
			>
				{/* ... icons ... */}
				{show ? (
					<FiMinimize
						className={cn(
							"w-6 h-6 sm:w-7 sm:h-7 text-white",
							"transition-transform duration-300 ease-in-out group-hover/mobile:rotate-[360deg] group-hover/mobile:scale-95"
						)}
					/>
				) : (
					<PiReadCvLogo
						className={cn(
							"w-6 h-6 sm:w-7 sm:h-7 text-white",
							"transition-transform duration-300 ease-in-out group-hover/mobile:rotate-[360deg] group-hover/mobile:scale-95"
						)}
					/>
				)}
			</Button>

			{/* Template Selection Modal - No changes needed */}
			<ChangeTemplate open={templateModal} setOpen={setTemplateModal} />

			{/* Main Preview Container - Adjusted height/flex properties */}
			<div
				className={cn(
					"transition-all duration-300 ease-in-out print:p-0 print:m-0",
					// --- Flexbox setup for both states ---
					"flex flex-col items-center",
					// Full-screen ('show' state) styles
					show
						? "fixed inset-0 z-40 bg-back/80 backdrop-blur-md p-4 print:relative print:inset-auto print:z-auto print:bg-transparent print:backdrop-blur-none print:p-0"
						: // Normal view styles
						  "hidden xl:flex h-full max-h-[calc(100vh-var(--navbar-height,4rem))] print:block print:max-h-none print:h-auto" // Use h-full within max-h constraint
				)}
			>
				{/* Template Settings Bar - Make it non-growing */}
				<div className="flex-shrink-0 w-full print:w-auto">
					{" "}
					{/* Wrapper to control shrinking */}
					<TemplateSettings
						openReview={openReview}
						show={show}
						setTemplateModal={setTemplateModal}
					/>
				</div>

				{/* Scrollable Area for the CV Template - Add min-h-0 */}
				<div
					className={cn(
						"w-full flex-grow overflow-auto print:overflow-visible print:h-auto",
						"mt-4 print:mt-0",
						// --- FIX: Add min-h-0 ---
						// This prevents the flex item from refusing to shrink below its content size, which is crucial for overflow-auto to work correctly within a constrained parent.
						"min-h-0"
					)}
				>
					{/* Render the selected template */}
					{
						{
							1: <Template1 />,
							2: <Template2 />,
						}[template.templateNumber || 1]
					}
				</div>
			</div>
		</div>
	);
};

export default CVPreview;
