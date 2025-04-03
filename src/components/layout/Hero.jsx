import React from "react";
import {
	FaArrowRight,
	FaRegEdit,
	FaRegListAlt,
	FaChartLine,
	FaFileAlt,
	FaFeatherAlt, // Note: FaFeatherAlt was imported but not used in the original features list
	FaUsers, // Note: FaUsers was imported but not used in the original features list
	FaCode,
} from "react-icons/fa";

// ================================================
// MODERN HERO COMPONENT
// ================================================
const Hero = () => {
	return (
		<>
			{/* ----- Hero Section ----- */}
			{/* Use brandGreen shades for the background gradient */}
			<div className="relative w-full bg-gradient-to-br from-brandGreen-50 via-brandGreen-100 to-brandGreen-200 py-32 md:py-40 flex justify-center overflow-hidden">
				{/* Background Overlay with Image and Gradient */}
				<div className="absolute inset-0">
					<img
						src="/bgtheme.jpg"
						alt="Background"
						className="w-full h-full object-cover opacity-30"
					/>
					{/* Standard black gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-b from-brandGreen-50 via-brandGreen-100 to-brandGreen-200 opacity-40"></div>
				</div>

				<div className="relative z-10 max-w-5xl px-6 text-center flex flex-col items-center gap-6">
					{/* Main Headline with subtle pulse animation - Use brandGreen and brand colors */}
					<h1 className="text-5xl md:text-7xl font-extrabold text-brand bg-clip-text bg-gradient-to-r from-brandGreen-600 via-brand to-brandGreen-600 pb-2 animate-pulse">
						Resume & Journal (ResJ)
					</h1>

					{/* Tagline - Use standard light gray */}
					<p className="text-2xl md:text-3xl font-medium text-brandGreen-500">
						Where Your Daily Journal Builds Your Resume.
					</p>

					{/* Description - Use standard very light gray */}
					<p className="max-w-3xl text-lg md:text-xl text-black leading-relaxed">
						Effortlessly capture your growth and craft a compelling resume. ResJ
						bridges daily journaling with professional presentation. Intuitive,
						free, no sign-up needed, and ready to export.
					</p>

					{/* Call to Action - Use brand and brandGreen-600 for hover */}
					<div className="mt-8 flex flex-col sm:flex-row gap-4">
						<a
							href="/#/resume"
							className="flex items-center gap-2 px-8 py-3 bg-brand text-white rounded-full font-semibold shadow-2xl transform transition-all duration-300 hover:scale-105 hover:bg-brandGreen-600"
							aria-label="Get started with ResJ resume builder"
						>
							Get Started <FaArrowRight className="ml-1" />
						</a>
					</div>
				</div>
			</div>

			{/* Render the other sections */}
			<AboutUsSection />
			<AboutCreatorsSection />
			<FeaturesOverviewSection />
		</>
	);
};

// ================================================
// MODERN ABOUT US SECTION
// ================================================
const AboutUsSection = () => {
	return (
		<div
			id="about-us"
			className="w-full bg-white py-24 md:py-32 px-4 sm:px-6 lg:px-8"
		>
			<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
				{/* Text Content */}
				<div className="order-2 md:order-1">
					{/* Use brandGreen-600 for heading */}
					<h2 className="text-4xl font-bold text-brandGreen-600 mb-6 leading-tight">
						Why ResJ? Bridging Reflection and Career Growth.
					</h2>
					{/* Use standard darker gray for paragraph text */}
					<p className="text-gray-700 text-lg leading-relaxed mb-5">
						We believe personal growth and career development are inextricably
						linked. Capturing daily thoughts, achievements, and challenges
						shouldn't just be for reflection – it should actively fuel your
						future success.
					</p>
					{/* Use standard darker gray for paragraph text */}
					<p className="text-gray-700 text-lg leading-relaxed">
						ResJ automates the connection between your everyday experiences and
						your professional narrative. We make it seamless to showcase your
						evolving skills and accomplishments without the usual
						resume-building hassle. Our mission is simple: empower you to{" "}
						{/* Use brandGreen-600 for highlighted text */}
						<span className="font-semibold text-brandGreen-600">
							reflect, grow, and advance
						</span>{" "}
						effortlessly.
					</p>
				</div>

				{/* Illustration */}
				<div className="order-1 md:order-2 flex justify-center items-center p-4 md:p-0">
					<img
						src="/Growth.png" // Make sure this image exists in your public folder
						alt="Illustration showing growth and reflection"
						className="max-w-md w-full h-auto transform transition-transform duration-500 hover:scale-105"
					/>
				</div>
			</div>
		</div>
	);
};

// ================================================
// MODERN ABOUT CREATORS SECTION
// ================================================
const AboutCreatorsSection = () => {
	const creators = [
		{
			name: "Gemin Khatri",
			age: 20,
			email: "www.geminkhatri@gmail.com",
			thoughts:
				"Passionate about turning daily reflections into actionable career insights.",
			avatar: "Gemin.PNG", // Placeholder - consider replacing with brandGreen-300 as background?
		},
		{
			name: "Mustafa Dholkawala",
			age: 20,
			email: "www.work.mustafa@gmail.com",
			thoughts:
				"Believing in the power of journaling to shape compelling resumes.",
			avatar: "/Mustafa.PNG", // Make sure this image exists in your public folder
		},
	];

	return (
		// Use standard light gray background
		<div className="w-full bg-gray-50 py-24 md:py-32 px-4 sm:px-6 lg:px-8">
			<div className="max-w-5xl mx-auto">
				{/* Use brandGreen-600 for heading */}
				<h2 className="text-4xl font-bold text-brandGreen-600 text-center mb-16 md:mb-20">
					Meet the Creators
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
					{creators.map((creator, index) => (
						<div
							key={index}
							// Use brandGreen-200 for hover border
							className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-2 border border-transparent hover:border-brandGreen-200"
						>
							<img
								src={creator.avatar}
								alt={`${creator.name}'s avatar`}
								className="w-28 h-28 rounded-full mb-5 object-cover border-4 border-gray-200 shadow-md" // Standard gray border for avatar
							/>
							{/* Use standard darker gray for name */}
							<h3 className="text-2xl font-semibold text-gray-700 mb-1">
								{creator.name}
							</h3>
							{/* Standard medium gray for age */}
							<p className="text-sm text-gray-500 mb-2">Age: {creator.age}</p>
							{/* Use brand color for email, brandGreen-600 for hover */}
							<a
								href={`mailto:${creator.email}`}
								className="text-sm text-brand hover:text-brandGreen-600 transition-colors break-all font-medium hover:underline"
							>
								{creator.email}
							</a>
							{/* Use standard darker gray for thoughts, brandGreen-200 for border */}
							<p className="text-gray-700 mt-5 text-base italic leading-relaxed border-l-4 border-brandGreen-200 pl-4 text-left">
								"{creator.thoughts}"
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

// ================================================
// MODERN FEATURES OVERVIEW SECTION
// ================================================
const FeaturesOverviewSection = () => {
	const features = [
		{
			icon: FaRegEdit,
			title: "Daily Logging",
			description:
				"Easily capture daily tasks, achievements, and reflections in a structured journal.",
		},
		{
			icon: FaFileAlt,
			title: "Automated Resume",
			description:
				"Relevant journal entries automatically suggested and formatted for your resume.",
		},
		{
			icon: FaRegListAlt,
			title: "Modern Templates",
			description:
				"Choose from professional resume templates designed for various industries.",
		},
		{
			icon: FaChartLine,
			title: "Growth Analytics",
			description:
				"Visualize your progress, skills development, and activity over time.",
		},
		{
			icon: FaArrowRight, // Reusing FaArrowRight here, consider a different icon if needed
			title: "Easy Export",
			description:
				"Download your polished resume in standard formats like PDF anytime.",
		},
		{
			icon: FaCode, // Using FaCode for Goal Tracking
			title: "Goal Tracking",
			description:
				"Set personal & professional goals and link journal entries to track progress.",
		},
	];

	return (
		<div
			id="features"
			// Use slightly different brandGreen shades for variation in gradient background
			className="w-full bg-gradient-to-br from-brandGreen-100 to-brandGreen-200 py-24 md:py-32 px-4 sm:px-6 lg:px-8"
		>
			<div className="max-w-6xl mx-auto">
				{/* Use brandGreen-600 for heading */}
				<h2 className="text-4xl font-bold text-brandGreen-600 text-center mb-16 md:mb-20">
					How ResJ Empowers You
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-transform duration-300 transform hover:scale-105"
						>
							{/* Use brandGreen-50 for icon bg, brand for icon color */}
							<div className="mb-4 p-3 rounded-full bg-brandGreen-50 inline-block">
								<feature.icon className="text-3xl text-brand" />
							</div>
							{/* Use brandGreen-600 for feature title */}
							<h3 className="text-xl font-semibold text-brandGreen-600 mb-2">
								{feature.title}
							</h3>
							{/* Use standard darker gray for description */}
							<p className="text-gray-700 text-sm leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Hero;
