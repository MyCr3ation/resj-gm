import React from "react";
import Journal from "../build/Journal";

const JournalPage = () => {
	return (
		<div className="w-full max-w-7xl mx-auto py-6">
			<div className="flex flex-col gap-6">
				<Journal />
			</div>
		</div>
	);
};

export default JournalPage;
