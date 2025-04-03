// Template1.jsx (Enhanced Original Design)
import React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { SiGithub } from "react-icons/si";
import { MdArrowOutward } from "react-icons/md";
import { cn, useFormattedTime } from "@/utils/helpers";
import { LOCALES, SOCIALS, uiSans } from "@/utils/constants";
import useStore from "@/store/store";
import useTemplateStore from "@/store/template";

// --- Helper: Section Component (Minor Enhancements) ---
const Section = ({
	id,
	title,
	children,
	color,
	align,
	size,
	titleCase,
	space,
}) => {
	return (
		<section
			id={`template1-${id}`}
			// Keep original classes, maybe add slightly more vertical gap inside if needed?
			className={cn(
				"flex items-center justify-center flex-col gap-1.5 w-full px-8", // Slightly increased internal gap from gap-1? Test visually.
				space // This applies margin-top based on user setting
			)}
		>
			{/* Enhanced title: slightly thinner border, color tied to titleColor? */}
			<h2
				style={{ color: color, borderColor: color ? `${color}50` : "#e5e5e5" }} // Border color subtle, related to text or default light gray
				className={cn(
					"pb-0.5 border-b font-semibold w-full", // Thinner border (border-b vs border-b-2), slightly less padding-bottom, semibold weight
					size,
					align,
					titleCase
				)}
			>
				{title}
			</h2>
			{/* Ensure children container takes full width and respects alignment */}
			<div
				className={cn(
					"w-full",
					align === "text-left"
						? "text-left"
						: align === "text-right"
						? "text-right"
						: "text-center"
				)}
			>
				{children}
			</div>
		</section>
	);
};

// --- Helper: Description Component (Minor Enhancements) ---
const Description = ({ state, color, size }) => {
	// Keep check for empty state
	if (!state || state === "<p><br></p>" || state === "<p></p>") return null;
	return (
		<div // Use a div wrapper to potentially scope prose styles if added later
			style={{ color: color || "#52525b" }} // Default to a zinc color if none provided
			dangerouslySetInnerHTML={{ __html: state }}
			// Use text-left for readability, slightly reduced opacity default
			className={cn("text-left mt-1 text-zinc-700", size)}
		/>
	);
};

// --- Helper: Style Calculation (Keep As Is) ---
const handleFindStyle = (state, x, y, z) => {
	const xOptions = ["small", "left", "lower", "less"];
	const yOptions = ["large", "right", "normal", "more"];
	if (xOptions.includes(state)) {
		return x;
	} else if (yOptions.includes(state)) {
		return y;
	} else {
		return z;
	}
};

// --- Main Template Component ---
const Template1 = ({}) => {
	const { store } = useStore();
	const { template } = useTemplateStore();
	const t = useTranslations();
	const locale = useLocale();

	// Locale for date formatting
	const localeIso = React.useMemo(
		() => LOCALES.find((lang) => lang.value === locale)?.iso || "en-US",
		[locale]
	);

	// --- Calculate Effective Styles (Enhanced Defaults) ---
	// Use slightly softer defaults than pure black
	const BASE_COLORS = {
		h1: "#18181b", // Zinc 900
		h2: "#3f3f46", // Zinc 700
		h3: "#52525b", // Zinc 600
		text: "#3f3f46", // Zinc 700 (same as H2 for subtle hierarchy)
		description: "#71717a", // Zinc 500
		hyperlink: "#0ea5e9", // Sky 500
	};

	const colorSettings = {
		h1Color: template.h1Color || BASE_COLORS.h1,
		h2Color: template.h2Color || BASE_COLORS.h2,
		h3Color: template.h3Color || BASE_COLORS.h3,
		textColor: template.textColor || BASE_COLORS.text,
		descriptionColor: template.descriptionColor || BASE_COLORS.description,
		hyperLinkColor: template.hyperLinkColor || BASE_COLORS.hyperlink,
	};

	// Keep original font size logic, just ensure uiSans is a good default
	const fontSettings = {
		fontFamily: template.fontFamily || uiSans, // Ensure uiSans is defined well (e.g., Inter, system-ui)
		h1FontSize: handleFindStyle(
			template.h1FontSize,
			"text-base xs:text-lg",
			"text-xl xs:text-2xl",
			"text-lg xs:text-xl"
		), // Slightly increased default/large sizes
		h2FontSize: handleFindStyle(
			template.h2FontSize,
			"text-sm xs:text-base",
			"text-lg xs:text-xl",
			"text-base xs:text-lg"
		), // Slightly increased default/large sizes
		h3FontSize: handleFindStyle(
			template.h3FontSize,
			"text-sm",
			"text-base xs:text-lg",
			"text-base"
		), // Default base size
		textFontSize: handleFindStyle(
			template.textFontSize,
			"text-xs",
			"text-sm",
			"text-sm"
		), // Default base size sm
		hyperLinkFontSize: handleFindStyle(
			template.hyperLinkFontSize,
			"text-xs",
			"text-sm",
			"text-sm"
		), // Default base size sm
		descriptionFontSize: handleFindStyle(
			template.descriptionFontSize,
			"text-xs",
			"text-sm",
			"text-sm"
		), // Default base size sm
	};

	// Keep original section settings logic
	const sectionSettings = {
		imageSize: parseInt(template.imageSize || "80"), // Keep 80 default
		spaceBetween: handleFindStyle(
			template.spaceBetween,
			"mt-3",
			"mt-6",
			"mt-4"
		), // Slightly adjusted 'less' spacing
		align: handleFindStyle(
			template.align,
			"text-left",
			"text-right",
			"text-center"
		),
		titleCase: handleFindStyle(
			template.titleCase,
			"lowercase",
			"normal-case",
			"uppercase"
		),
		projectLink: template.projectLink || "", // Default to text
	};

	// --- Render Template ---
	return (
		<div
			style={{ fontFamily: fontSettings.fontFamily }}
			// Added subtle background, increased padding, default text color
			className="w-[210mm] min-h-[297mm] bg-white text-zinc-800 my-0 mx-auto p-8 shadow-md rounded-sm overflow-x-hidden overflow-y-visible print:shadow-none print:bg-transparent print:p-6"
		>
			{/* --- Header Section --- */}
			<div
				className={cn(
					"flex flex-col items-center justify-between w-full text-center px-8 mb-6",
					sectionSettings.align
				)}
			>
				{" "}
				{/* Apply alignment here */}
				{store.image && (
					<Image
						src={store.image}
						height={sectionSettings.imageSize}
						width={sectionSettings.imageSize}
						alt={t("Personal")}
						className="rounded-full mb-3" // Add margin bottom to image
					/>
				)}
				<h1
					style={{ color: colorSettings.h1Color }}
					className={cn(
						"whitespace-nowrap w-full font-bold", // Removed uppercase, user can control with titleCase if needed elsewhere or we add a specific setting
						// sectionSettings.align, // Alignment handled by parent now
						fontSettings.h1FontSize
					)}
				>
					{store.general.name} {store.general.surname}
				</h1>
				{/* Contact Info - using flex-wrap for better responsiveness */}
				<p
					style={{ color: colorSettings.textColor }}
					className={cn(
						"w-full mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 items-center", // Use flex-wrap, adjust gap/margin
						fontSettings.textFontSize,
						// sectionSettings.align, // Alignment handled by parent now
						// Justify content based on parent alignment
						sectionSettings.align === "text-left"
							? "justify-start"
							: sectionSettings.align === "text-right"
							? "justify-end"
							: "justify-center"
					)}
				>
					{(store.general.city || store.general.country) && (
						<span>
							{store.general.city}
							{store.general.city && store.general.country && ", "}
							{store.general.country}
						</span>
					)}
					{store.general.email && (
						<>
							{(store.general.city || store.general.country) && (
								<span className="text-zinc-400 mx-1">•</span>
							)}
							<a
								className={cn(
									"hover:underline",
									fontSettings.hyperLinkFontSize
								)}
								style={{ color: colorSettings.hyperLinkColor }}
								target="_blank"
								rel="noopener noreferrer"
								href={`mailto:${store.general.email}`}
							>
								{store.general.email}
							</a>
						</>
					)}
					{store.general.phone && (
						<>
							{(store.general.city ||
								store.general.country ||
								store.general.email) && (
								<span className="text-zinc-400 mx-1">•</span>
							)}
							<a
								className={cn(
									"hover:underline",
									fontSettings.hyperLinkFontSize
								)}
								style={{ color: colorSettings.hyperLinkColor }}
								target="_blank"
								rel="noopener noreferrer"
								href={`tel:${store.general.phone}`}
							>
								{store.general.phone}
							</a>
						</>
					)}
				</p>
			</div>

			{/* --- Main Content Sections --- */}
			{/* Summary - Render directly without Section wrapper? */}
			{store.summary && store.summary !== "<p><br></p>" && (
				<section
					id="template1-summary"
					className={cn("w-full px-8", sectionSettings.spaceBetween)}
				>
					<div
						dangerouslySetInnerHTML={{ __html: store.summary }}
						style={{ color: colorSettings.textColor }}
						// Apply alignment and text size, maybe prose for better list/bold handling
						className={cn(
							"prose prose-sm max-w-none",
							fontSettings.textFontSize,
							sectionSettings.align
						)}
					></div>
				</section>
			)}

			{/* Socials */}
			{Object.values(store.socialLinks || {}).some((link) => link) && (
				<Section
					id="socials"
					title={t("Social")}
					color={colorSettings.h2Color}
					size={fontSettings.h2FontSize}
					align={sectionSettings.align}
					titleCase={sectionSettings.titleCase}
					space={sectionSettings.spaceBetween}
				>
					{/* Use flex-wrap again */}
					<div
						className={cn(
							"flex items-center flex-wrap gap-x-4 gap-y-1 w-full",
							// Justify based on the section alignment setting
							sectionSettings.align === "text-left"
								? "justify-start"
								: sectionSettings.align === "text-right"
								? "justify-end"
								: "justify-center"
						)}
					>
						{Object.entries(store.socialLinks || {})
							.filter(([, value]) => value)
							.map(([key, value]) => {
								const social = SOCIALS.find(
									(e) => e.name.toLowerCase() === key
								);
								if (!social) return null;
								const url = value.startsWith("http")
									? value
									: `https://${value}`;
								// Slightly improved display logic
								const displayValue = value
									.replace(/^https?:\/\/(www\.)?/, "")
									.split("/")[0]; // Show domain or first part

								return (
									<a
										href={url}
										target="_blank"
										rel="noopener noreferrer"
										key={key}
										className={cn(
											"inline-flex items-center gap-1.5 hover:underline",
											fontSettings.hyperLinkFontSize
										)}
										style={{ color: colorSettings.hyperLinkColor }}
									>
										<span className="text-lg">{social.logo}</span>{" "}
										{/* Slightly larger icon */}
										<span>{displayValue}</span>
									</a>
								);
							})}
					</div>
				</Section>
			)}

			{/* Experience */}
			{store.experience?.length > 0 && (
				<Section
					id="experience"
					title={t("Experience")}
					color={colorSettings.h2Color}
					size={fontSettings.h2FontSize}
					align={sectionSettings.align}
					titleCase={sectionSettings.titleCase}
					space={sectionSettings.spaceBetween}
				>
					<div className="w-full flex flex-col gap-2.5">
						{" "}
						{/* Added gap between experience entries */}
						{store.experience.map((exp, index) => (
							<div key={index} className="flex flex-col w-full text-left">
								{" "}
								{/* Keep items left-aligned */}
								<div className="flex items-baseline justify-between w-full">
									{" "}
									{/* Use baseline alignment */}
									<h3
										className={cn("font-medium", fontSettings.h3FontSize)} // Medium weight H3
										style={{ color: colorSettings.h3Color }}
									>
										{exp.jobTitle}
									</h3>
									<p
										style={{ color: colorSettings.textColor }}
										className={cn(
											"text-xs flex-shrink-0 ml-2",
											fontSettings.textFontSize
										)} // Smaller date
									>
										{useFormattedTime(exp.startDate, localeIso)} -{" "}
										{exp.endDate
											? useFormattedTime(exp.endDate, localeIso)
											: t("Present")}
									</p>
								</div>
								<h4
									style={{ color: colorSettings.textColor }}
									className={cn(
										"font-normal text-sm",
										fontSettings.textFontSize
									)} // Use text size, normal weight
								>
									{exp.company}
									{exp.company && exp.city && ", "}
									{exp.city}
								</h4>
								<Description
									color={colorSettings.descriptionColor}
									size={fontSettings.descriptionFontSize}
									state={exp.description}
								/>
							</div>
						))}
					</div>
				</Section>
			)}

			{/* Education */}
			{store.education?.length > 0 && (
				<Section
					id="education"
					title={t("Education")}
					color={colorSettings.h2Color}
					size={fontSettings.h2FontSize}
					align={sectionSettings.align}
					titleCase={sectionSettings.titleCase}
					space={sectionSettings.spaceBetween}
				>
					<div className="w-full flex flex-col gap-2.5">
						{" "}
						{/* Added gap between education entries */}
						{store.education.map((edu, index) => (
							<div key={index} className="flex flex-col w-full text-left">
								{" "}
								{/* Keep items left-aligned */}
								<div className="flex items-baseline justify-between w-full">
									<h3
										className={cn("font-medium", fontSettings.h3FontSize)} // Medium weight H3
										style={{ color: colorSettings.h3Color }}
									>
										{edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}{" "}
										{/* Cleaner field display */}
									</h3>
									<p
										style={{ color: colorSettings.textColor }}
										className={cn(
											"text-xs flex-shrink-0 ml-2",
											fontSettings.textFontSize
										)} // Smaller date
									>
										{useFormattedTime(edu.startDate, localeIso)} -{" "}
										{edu.endDate
											? useFormattedTime(edu.endDate, localeIso)
											: t("Present")}
									</p>
								</div>
								<h4
									style={{ color: colorSettings.textColor }}
									className={cn(
										"font-normal text-sm",
										fontSettings.textFontSize
									)} // Use text size, normal weight
								>
									{edu.institution}
									{edu.institution && edu.city && ", "}
									{edu.city}
								</h4>
								<Description
									color={colorSettings.descriptionColor}
									size={fontSettings.descriptionFontSize}
									state={edu.description}
								/>
							</div>
						))}
					</div>
				</Section>
			)}

			{/* Skills */}
			{store.skills?.length > 0 && (
				<Section
					id="skills"
					title={t("Skills")}
					color={colorSettings.h2Color}
					size={fontSettings.h2FontSize}
					align={sectionSettings.align}
					titleCase={sectionSettings.titleCase}
					space={sectionSettings.spaceBetween}
				>
					<p
						style={{ color: colorSettings.textColor }}
						className={cn(
							"w-full",
							fontSettings.textFontSize,
							sectionSettings.align
						)}
					>
						{/* Keep comma separated for simplicity, ensure alignment */}
						{store.skills.join(", ")}
					</p>
				</Section>
			)}

			{/* Projects */}
			{store.projects?.length > 0 && (
				<Section
					id="projects"
					title={t("Projects")}
					color={colorSettings.h2Color}
					size={fontSettings.h2FontSize}
					align={sectionSettings.align}
					titleCase={sectionSettings.titleCase}
					space={sectionSettings.spaceBetween}
				>
					<div className="w-full flex flex-col gap-3">
						{" "}
						{/* Gap between projects */}
						{store.projects.map((project, index) => (
							<div key={index} className="flex flex-col w-full text-left">
								{" "}
								{/* Keep left-aligned */}
								<div className="flex items-baseline justify-between w-full gap-2">
									<h3
										className={cn("font-medium", fontSettings.h3FontSize)}
										style={{ color: colorSettings.h3Color }}
									>
										{project.title}
									</h3>
									<div
										className={cn(
											"flex items-center gap-x-2 gap-y-0.5 flex-shrink-0 flex-wrap",
											fontSettings.hyperLinkFontSize
										)}
									>
										{" "}
										{/* Link container */}
										{project.liveLink && (
											<a
												target="_blank"
												rel="noopener noreferrer"
												href={
													project.liveLink.startsWith("http")
														? project.liveLink
														: `https://${project.liveLink}`
												}
												className="inline-flex items-center gap-1 hover:underline"
												style={{ color: colorSettings.hyperLinkColor }}
											>
												{sectionSettings.projectLink === "icon" ? (
													<MdArrowOutward size={14} />
												) : (
													t("Projects.live")
												)}
											</a>
										)}
										{project.githubLink && (
											<a
												target="_blank"
												rel="noopener noreferrer"
												href={
													project.githubLink.startsWith("http")
														? project.githubLink
														: `https://${project.githubLink}`
												}
												className="inline-flex items-center gap-1 hover:underline"
												style={{ color: colorSettings.hyperLinkColor }}
											>
												{sectionSettings.projectLink === "icon" ? (
													<SiGithub size={12} />
												) : (
													t("Projects.github")
												)}
											</a>
										)}
									</div>
								</div>
								{/* Technologies */}
								{project?.technologies?.length > 0 && (
									<p
										style={{ color: colorSettings.textColor }}
										className={cn("text-xs mt-0.5", fontSettings.textFontSize)} // Slightly smaller tech list
									>
										<span className="font-medium mr-1.5">
											{t("Projects.tech")}:
										</span>
										{project.technologies.join(" · ")}
									</p>
								)}
								<Description
									color={colorSettings.descriptionColor}
									size={fontSettings.descriptionFontSize}
									state={project.description}
								/>
							</div>
						))}
					</div>
				</Section>
			)}

			{/* Remaining sections (Certificates, References, Languages, Interests) - apply similar enhancements */}
			{/* Apply gap-2.5 in parent div, keep items text-left, use font-medium for H3 etc. */}

			{/* Example: Languages Enhancement */}
			{store.languages?.length > 0 && (
				<Section
					id="languages"
					title={t("Languages")}
					color={colorSettings.h2Color}
					size={fontSettings.h2FontSize}
					align={sectionSettings.align}
					titleCase={sectionSettings.titleCase}
					space={sectionSettings.spaceBetween}
				>
					<div
						className={cn(
							"flex flex-wrap gap-x-6 gap-y-1 w-full",
							fontSettings.textFontSize,
							sectionSettings.align === "text-center"
								? "justify-center"
								: sectionSettings.align === "text-right"
								? "justify-end"
								: "justify-start"
						)}
					>
						{" "}
						{/* Keep alignment consistent */}
						{store.languages.map((lang, index) => (
							<div key={index} className="flex">
								<p
									className="font-medium mr-2"
									style={{ color: colorSettings.h3Color }}
								>
									{lang.language}:
								</p>
								<p style={{ color: colorSettings.textColor }}>
									{t(`${lang.level}`)}
								</p>
							</div>
						))}
					</div>
				</Section>
			)}

			{/* Example: Interests Enhancement */}
			{store.interests?.length > 0 && (
				<Section
					id="interests"
					title={t("Interests")}
					color={colorSettings.h2Color}
					size={fontSettings.h2FontSize}
					align={sectionSettings.align}
					titleCase={sectionSettings.titleCase}
					space={sectionSettings.spaceBetween}
				>
					<p
						style={{ color: colorSettings.textColor }}
						className={cn(
							"w-full",
							fontSettings.textFontSize,
							sectionSettings.align
						)}
					>
						{/* Use a different separator? */}
						{store.interests.join(" • ")}
					</p>
				</Section>
			)}

			{/* Add Certificates and References following the pattern of Experience/Education */}
			{/* Certificates */}
			{store.certificates?.length > 0 && (
				<Section
					id="certificates"
					title={t("Certificates")}
					color={colorSettings.h2Color}
					size={fontSettings.h2FontSize}
					align={sectionSettings.align}
					titleCase={sectionSettings.titleCase}
					space={sectionSettings.spaceBetween}
				>
					<div className="w-full flex flex-col gap-2.5">
						{store.certificates.map((certificate, index) => (
							<div key={index} className="flex flex-col w-full text-left">
								<div className="flex items-baseline justify-between w-full">
									<h3
										className={cn("font-medium", fontSettings.h3FontSize)}
										style={{ color: colorSettings.h3Color }}
									>
										{certificate.title}
									</h3>
									<p
										style={{ color: colorSettings.textColor }}
										className={cn(
											"text-xs flex-shrink-0 ml-2",
											fontSettings.textFontSize
										)}
									>
										{useFormattedTime(certificate.date, localeIso)}
									</p>
								</div>
								<Description
									color={colorSettings.descriptionColor}
									size={fontSettings.descriptionFontSize}
									state={certificate.description}
								/>
							</div>
						))}
					</div>
				</Section>
			)}

			{/* References */}
			{store.references?.length > 0 && (
				<Section
					id="references"
					title={t("References")}
					color={colorSettings.h2Color}
					size={fontSettings.h2FontSize}
					align={sectionSettings.align}
					titleCase={sectionSettings.titleCase}
					space={sectionSettings.spaceBetween}
				>
					<div className="w-full flex flex-col gap-2.5">
						{store.references.map((ref, index) => (
							<div key={index} className="flex flex-col w-full text-left mb-1">
								<h3
									className={cn("font-medium", fontSettings.h3FontSize)}
									style={{ color: colorSettings.h3Color }}
								>
									{ref.name} {ref.company && `- ${ref.company}`}
								</h3>
								<div
									className={cn(
										"flex items-center gap-x-3 gap-y-0.5 flex-wrap",
										fontSettings.textFontSize
									)}
								>
									{ref.email && (
										<a
											className={cn(
												"hover:underline",
												fontSettings.hyperLinkFontSize
											)}
											target="_blank"
											rel="noopener noreferrer"
											href={`mailto:${ref.email}`}
											style={{ color: colorSettings.hyperLinkColor }}
										>
											{ref.email}
										</a>
									)}
									{ref.email && ref.phone && (
										<span className="text-zinc-400 mx-1">|</span>
									)}
									{ref.phone && (
										<a
											className={cn(
												"hover:underline",
												fontSettings.hyperLinkFontSize
											)}
											target="_blank"
											rel="noopener noreferrer"
											href={`tel:${ref.phone}`}
											style={{ color: colorSettings.hyperLinkColor }}
										>
											{ref.phone}
										</a>
									)}
								</div>
							</div>
						))}
						<p
							className={cn(
								"text-xs italic w-full pt-1",
								sectionSettings.align === "text-right"
									? "text-right"
									: "text-left"
							)}
							style={{ color: colorSettings.descriptionColor }}
						>
							*{t("References.available")}
						</p>
					</div>
				</Section>
			)}
		</div> // End Main Container
	);
};

export default Template1;
