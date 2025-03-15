import React from "react";

export default function Editor({
	state,
	setState,
	value,
	onChange,
	label,
	placeholder,
}) {
	return (
		<div className="relative">
			{label && (
				<label
					title={state}
					className={`absolute flex items-center gap-1 text-sm text-gray duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 select-none ${
						(state !== "" || state?.length > 0) && "bg-white text-green-800"
					}`}
				>
					{label}
				</label>
			)}
			<textarea
				id="editor-textarea"
				value={value || ""}
				onChange={(e) => onChange(e.target.value)}
				rows={8}
				className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-brandGreen-200
                   focus:border-brandGreen-300 transition-colors"
				placeholder={placeholder}
			/>
		</div>
	);
}
