import React from "react";
import { FaArrowRight } from "react-icons/fa";

const Hero = () => {
	return (
		<div className="w-full max-w-5xl flex flex-col items-center gap-6 sm:gap-8">
			<h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-brandGreen-500 via-brand to-brandGreen-500 bg-clip-text text-transparent animate-glow">
				Resume and Journal (ResJ)
			</h1>
			<p className="text-xl md:text-2xl text-center max-w-2xl px-6">
				Stop wasting time on tedious resume creation. ResJ offers a simple,
				efficient way to build a compelling resume and manage your career
				journey. Our intuitive builder lets you craft a professional document in
				minutes, while the integrated journal helps you stay organized and
				focused on your goals. It's free, no sign-up needed, and ready to export
				whenever you are. ResJ is completely free to use.
			</p>
			<div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
				<a
					href="/"
					onClick={(e) => {
						e.preventDefault();
						const buildLink = document.querySelector('[data-section="resume"]');
						if (buildLink) {
							buildLink.click();
							// Force navigation as a backup with hash router
							window.location.hash = "/signup";
						}
					}}
					className="flex items-center justify-center gap-2 w-full sm:w-fit px-6 py-3 bg-brand text-black rounded-lg font-medium no-underline hover:bg-opacity-90 transition-all"
				>
					Start with ResJ <FaArrowRight />
				</a>
			</div>
		</div>
	);
};

export default Hero;
