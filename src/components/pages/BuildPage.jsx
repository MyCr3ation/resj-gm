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
import useStore from "../../store/store.jsx";
import { toast } from "react-hot-toast";
import { TiTick } from "react-icons/ti";

const BuildPage = () => {
	const [activeSection, setActiveSection] = useState("personal");
	const { store, loadSampleData } = useStore();

	const handleLoadSampleData = () => {
		loadSampleData();
		toast.success("Sample data loaded successfully!");
	};

	const isSectionComplete = (sectionId, store) => {
		switch (sectionId) {
			case "personal":
				return Object.entries(store.general).every(([key, value]) => {
					if (key === "driving") {
						// Skip validation for driver's license
						return true;
					}
					return value !== "" && value !== null;
				});

			case "social":
				return Object.values(store.socialLinks).every(
					(value) => value !== "" && value !== null
				);
			case "summary":
				return store.summary && store.summary.trim() !== "";
			case "experience":
				return store.experience.length > 0;
			case "education":
				return store.education.length > 0;
			case "skills":
				return store.skills.length > 0;
			case "projects":
				return store.projects.length > 0;
			case "languages":
				return store.languages.length > 0;
			case "certificates":
				return store.certificates.length > 0;
			case "interests":
				return store.interests.length > 0;
			case "references":
				return store.references.length > 0;
			default:
				return false;
		}
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
		<div className="w-screen max-w-7xl  py-6">
			<div className="flex flex-col w-screen lg:flex-row gap-6">
				{/* Sidebar */}
				<aside className="w-full lg:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit sticky top-6">
					<div className="flex flex-col gap-2">
						<h3 className="text-lg font-semibold mb-4 text-brand">
							Resume Sections
						</h3>

						{sections.map((section) => (
							<button
								key={section.id}
								className={`text-left px-3 py-2 rounded-md transition-colors flex ${
									activeSection === section.id
										? "bg-brand text-white"
										: "hover:bg-gray-100"
								}`}
								onClick={() => setActiveSection(section.id)}
							>
								{isSectionComplete(section.id, store) &&
									!activeSection.includes(section.id) && (
										<TiTick className="text-brand mr-1" size={20} />
									)}
								{section.label}
							</button>
						))}
					</div>
				</aside>

				{/* Main content */}
				<div className="flex-1 w-full">
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
				</div>
			</div>
		</div>
	);
};

export default BuildPage;
