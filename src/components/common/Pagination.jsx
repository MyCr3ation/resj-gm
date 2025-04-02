// Pagination.jsx
import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import clsx from "clsx"; // Use clsx for conditional classes

// --- Helper Function (same as before) ---
const DOTS = "...";

const generatePageNumbers = (currentPage, totalPages, neighbours = 1) => {
	// ... (keep the existing generatePageNumbers function)
	const totalNumbers = neighbours * 2 + 3;
	const totalBlocks = totalNumbers + 2;

	if (totalPages <= totalBlocks) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const leftSiblingIndex = Math.max(currentPage - neighbours, 1);
	const rightSiblingIndex = Math.min(currentPage + neighbours, totalPages);

	const shouldShowLeftDots = leftSiblingIndex > 2;
	const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

	const firstPageIndex = 1;
	const lastPageIndex = totalPages;

	if (!shouldShowLeftDots && shouldShowRightDots) {
		let leftItemCount = 3 + 2 * neighbours;
		let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
		return [...leftRange, DOTS, lastPageIndex];
	} else if (shouldShowLeftDots && !shouldShowRightDots) {
		let rightItemCount = 3 + 2 * neighbours;
		let rightRange = Array.from(
			{ length: rightItemCount },
			(_, i) => totalPages - rightItemCount + i + 1
		);
		return [firstPageIndex, DOTS, ...rightRange];
	} else {
		let middleRange = Array.from(
			{ length: rightSiblingIndex - leftSiblingIndex + 1 },
			(_, i) => leftSiblingIndex + i
		);
		return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
	}
};
// --- End Helper Function ---

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	if (totalPages <= 1) {
		return null;
	}

	const handlePrevious = () => onPageChange(Math.max(1, currentPage - 1));
	const handleNext = () => onPageChange(Math.min(totalPages, currentPage + 1));

	const pageNumbers = generatePageNumbers(currentPage, totalPages, 1); // Use 1 neighbour

	// --- Styling Classes ---
	const baseCircleClasses = clsx(
		"relative",
		"flex items-center justify-center",
		"rounded-full border", // Keep border for definition
		"text-sm font-semibold",
		"transition-all duration-200 ease-in-out",
		"focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brandGreen-500"
	);

	const pageButtonClasses = clsx(
		baseCircleClasses,
		"size-9", // Base size for non-active
		"bg-white border-gray-300 text-gray-600", // White background for contrast
		"hover:border-gray-400 hover:scale-110 hover:shadow-md hover:z-20",
		"[box-shadow:#0000001a_0_1px_3px,#0000002a_0_0_1px]" // Slightly softer shadow
	);

	const activePageButtonClasses = clsx(
		baseCircleClasses,
		"size-10", // Keep slightly larger for prominence
		// Ensure this background provides good contrast with white text:
		"bg-brandGreen-600 border-brandGreen-700 border-2", // Or maybe bg-brandGreen-700 / bg-brandGreen-800
		"text-white", // This will now color the visible number white
		"font-bold", // Optional: make the active number bold
		"cursor-default shadow-xl z-10"
	);

	const dotsClasses = clsx(
		"relative flex items-center justify-center",
		"size-8 text-gray-400 font-bold", // Use a neutral color for dots
		"-ml-2 px-1"
	);

	const arrowButtonClasses = clsx(
		baseCircleClasses,
		"size-9",
		"bg-white border-gray-300 text-gray-500", // White background
		"hover:bg-gray-50 hover:scale-105",
		"disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white"
	);
	// --- End Styling Classes ---

	return (
		<nav
			className="flex items-center justify-between px-4 py-3 sm:px-6 mt-8"
			aria-label="Pagination"
		>
			{/* --- Mobile View (Kept simple, full width for tap targets) --- */}
			<div className="flex flex-1 justify-between items-center sm:hidden">
				<button
					onClick={handlePrevious}
					disabled={currentPage === 1}
					// Using standard mobile button style for clarity
					className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
				>
					Previous
				</button>
				<div className="text-sm text-gray-700 mx-2">
					Page {currentPage} of {totalPages}
				</div>
				<button
					onClick={handleNext}
					disabled={currentPage === totalPages}
					className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
				>
					Next
				</button>
			</div>

			{/* --- Desktop View (Circular Design, Right Aligned) --- */}
			{/* Changed justify-between to justify-end, removed left-side info */}
			<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
				{/* Pagination Controls Container */}
				<div className="flex items-center space-x-1">
					{/* Previous Button */}
					<button
						onClick={handlePrevious}
						disabled={currentPage === 1}
						className={arrowButtonClasses}
						aria-label="Previous"
					>
						<FiChevronLeft className="h-5 w-5" aria-hidden="true" />
					</button>

					{/* Page Numbers / Ellipses Container */}
					<div className="flex items-center">
						{pageNumbers.map((page, index) => {
							const overlapClass = index > 0 ? "-ml-2" : "";

							if (page === DOTS) {
								return (
									<span
										key={`dots-${index}`}
										className={clsx(dotsClasses, overlapClass)}
										style={{ zIndex: index }}
									>
										{DOTS}
									</span>
								);
							} else {
								const isCurrent = page === currentPage;
								return (
									<button
										key={page}
										onClick={() => onPageChange(page)}
										disabled={isCurrent}
										className={clsx(
											isCurrent ? activePageButtonClasses : pageButtonClasses,
											overlapClass
										)}
										style={{ zIndex: isCurrent ? 15 : index }}
										aria-current={isCurrent ? "page" : undefined}
										aria-label={`Go to page ${page}`}
									>
										{/* --- Always render the number --- */}
										{page}
										{/* --- text-white in activePageButtonClasses will handle color --- */}
									</button>
								);
							}
						})}
					</div>

					{/* Next Button */}
					<button
						onClick={handleNext}
						disabled={currentPage === totalPages}
						className={arrowButtonClasses}
						aria-label="Next"
					>
						<FiChevronRight className="h-5 w-5" aria-hidden="true" />
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Pagination;
