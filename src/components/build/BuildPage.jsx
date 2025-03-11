import React, { useState } from "react";
import Personal from "./Personal";
import Social from "./Social";
import Summary from "./Summary";
import Skills from "./Skills";
import Experience from "./Experience";
import Education from "./Education";
import Projects from "./Projects";
import Certificates from "./Certificates";
import Interests from "./Interests";
import References from "./References";
import Languages from "./Languages";
// import Additional from "./Additional";
import useStore from "../../store/store.jsx";
import { toast } from "react-hot-toast";

const BuildPage = () => {
	const [activeSection, setActiveSection] = useState("personal");
	const { loadSampleData } = useStore();

	const handleLoadSampleData = () => {
		loadSampleData();
		toast.success("Sample data loaded successfully!");
	};

	const sections = [
		{ id: "personal", label: "Personal Information" },
		{ id: "social", label: "Social Links" },
		{ id: "summary", label: "Summary" },
		{ id: "experience", label: "Experience" },
		{ id: "education", label: "Education" },
		{ id: "skills", label: "Skills" },
		{ id: "projects", label: "Projects" },
		{ id: "languages", label: "Languages" },
		{ id: "certificates", label: "Certificates" },
		{ id: "interests", label: "Interests" },
		{ id: "references", label: "References" },
	];

	return (
		<div className="w-full max-w-7xl mx-auto py-6">
			<div className="flex flex-col lg:flex-row gap-6">
				{/* Sidebar */}
				<aside className="w-full lg:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit sticky top-6">
					<div className="flex flex-col gap-2">
						<h3 className="text-lg font-semibold mb-4">Resume Sections</h3>

						{sections.map((section) => (
							<button
								key={section.id}
								className={`text-left px-3 py-2 rounded-md transition-colors ${
									activeSection === section.id
										? "bg-main text-white"
										: "hover:bg-gray-100"
								}`}
								onClick={() => setActiveSection(section.id)}
							>
								{section.label}
							</button>
						))}

						<div className="border-t border-gray-200 my-4"></div>

						<button
							className="w-full px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
							onClick={handleLoadSampleData}
						>
							Load Sample Data
						</button>
					</div>
				</aside>

				{/* Main content */}
				<div className="flex-1">
					{activeSection === "personal" && <Personal />}
					{activeSection === "social" && <Social />}
					{activeSection === "summary" && <Summary />}
					{activeSection === "skills" && <Skills />}
					{activeSection === "experience" && <Experience />}
					{activeSection === "education" && <Education />}
					{activeSection === "projects" && <Projects />}
					{activeSection === "languages" && <Languages />}
					{activeSection === "certificates" && <Certificates />}
					{activeSection === "interests" && <Interests />}
					{activeSection === "references" && <References />}

					{/* Placeholder for sections not yet implemented */}
					{!["personal", "summary"].includes(activeSection) && (
						<div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
							<h2 className="text-2xl font-semibold mb-6">
								{sections.find((s) => s.id === activeSection)?.label}
							</h2>
							<p>This section is currently being developed.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default BuildPage;
