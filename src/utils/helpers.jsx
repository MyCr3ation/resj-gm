import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { azMonths } from "./constants.jsx";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

//* Create formatted time
export const useFormattedTime = (time, locale) => {
	if (!time) return "";
	const date = new Date(time);

	if (locale === "az-AZ") {
		const month = azMonths[date.getMonth()];
		const year = date.getFullYear();
		return `${month} ${year}`;
	}

	const options = { month: "short", year: "numeric" };
	const formattedDate = date.toLocaleDateString(locale || "en-US", options);

	return formattedDate;
};

//* Sort functions
export const handleMoveItem = (
	Items,
	updateItemOrder,
	index,
	direction,
	place
) => {
	if (
		(direction === "up" && index > 0) ||
		(direction === "down" && index < Items.length - 1)
	) {
		const updatedItems = [...Items];
		const [movedItem] = updatedItems.splice(index, 1);
		updatedItems.splice(
			direction === "up" ? index - 1 : index + 1,
			0,
			movedItem
		);
		updateItemOrder(place, updatedItems);
	}
};

//* Copy to Clipboard
export const copyToClipboard = (text) => {
	navigator.clipboard.writeText(text);
};

//* Scroll
export const scrollToSection = (top) => {
	window.scrollTo({
		top: top,
		behavior: "smooth",
	});
};
