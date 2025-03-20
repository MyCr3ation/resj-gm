import React, { useState, useEffect } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

const SectionTitle = ({ children, tooltip }) => (
	<h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center justify-center md:justify-start">
		{children}
		{tooltip && (
			<AiOutlineInfoCircle
				title={tooltip}
				className="inline ml-2 cursor-pointer text-brandGreen-400"
			/>
		)}
	</h3>
);

export default SectionTitle;
