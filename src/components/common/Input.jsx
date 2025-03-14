// Input.jsx
import { cn } from "../../utils/helpers";
// import { useTranslations } from "next-intl"; // Removed: Not using next-intl
import { useState } from "react";
import { FaCalendarTimes, FaCalendarAlt } from "react-icons/fa"; // Import calendar icon

const Input = ({
	state,
	setState,
	label,
	name,
	type = "text",
	present,
	className,
	className__input,
	inputRef,
}) => {
	// Simple translation function replacement (since we're not using next-intl)
	const t = (key) => key;

	const [presentStatus, setPresentStatus] = useState(false);

	const setPresent = () => {
		setState("");
		setPresentStatus(!presentStatus);
	};

	const currentYear = new Date().getFullYear();
	const maxMonth = `${currentYear}-12`;
	const minMonth = `${currentYear - 100}-12`;
	const maxDate = new Date().toISOString().split("T")[0];

	return (
		<div className={cn("relative w-full", className)}>
			<input
				type={type}
				name={name}
				value={state}
				id={name}
				className={cn(
					"block px-4 py-2 w-full text-sm bg-transparent rounded-md border-1 appearance-none text-gray-900 border-gray-600 focus:outline-none focus:ring-0 focus:border-brand peer border disabled:opacity-50 h-10",
					className__input
				)}
				placeholder=" "
				disabled={presentStatus && type !== "date"} // Keep disabled logic, but allow date
				onChange={(e) => setState(e.target.value)}
				max={
					type === "month" ? maxMonth : type === "date" ? maxDate : undefined
				}
				min={type === "month" ? minMonth : undefined}
				ref={inputRef}
			/>
			<label
				title={state}
				htmlFor={name}
				className={`absolute flex items-center gap-1 text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 select-none ${
					(state !== "" || state?.length > 0) && "bg-white text-brand"
				}`}
			>
				{label}
				{/* Present button (only if 'present' prop is true) */}
				{present && type !== "date" && (
					<button
						type="button"
						className={`bg-gray-800 px-2 rounded-md flex items-center gap-1 whitespace-nowrap ${
							presentStatus ? "text-brand" : "text-gray-400"
						}`}
						onClick={setPresent}
					>
						{t("present")} <FaCalendarTimes />
					</button>
				)}
				{/* Always show calendar icon for date type */}
				{type === "date" && <FaCalendarAlt className="text-gray-400 ml-1" />}
			</label>
		</div>
	);
};

export default Input;
