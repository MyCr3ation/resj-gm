// Template2.jsx

import React from "react";
import { cn, useFormattedTime } from "@/utils/helpers";
import { LOCALES, SOCIALS, uiSans } from "@/utils/constants";
import useStore from "@/store/store";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { SiGithub } from "react-icons/si";
import { MdArrowOutward } from "react-icons/md";
import useTemplateStore from "@/store/template";

// Section Component: Added more bottom margin after the title
const Section = ({
	id,
	title,
	children,
	color,
	align,
	size,
	titleCase,
	space, // Overall space before the section
	className,
}) => {
	return (
		<section
			id={`template2-${id}`} // Changed ID prefix for clarity if needed
			className={cn(
				"flex items-center justify-center flex-col gap-2 w-full print-break-inside-avoid", // Avoid breaking inside section for print
				space,
				className
			)}
		>
			<h2
				style={{ color: color, borderColor: color }} // Use color for border too
				className={cn(
					"pb-1 mb-3 border-b-2 font-bold w-full", // Increased bottom margin
					size,
					align,
					titleCase
				)}
			>
				{title}
			</h2>
			{children}
		</section>
	);
};

// Description Component: Added subtle opacity if no specific color is set
const Description = ({ state, color, size }) => {
	if (!state || state === "<p><br></p>") return null; // Return null for empty
	return (
		<p
			style={{ color: color }}
			dangerouslySetInnerHTML={{ __html: state }}
			// Use opacity-80 for default description text unless a specific color is provided
			className={cn("text-left mt-1.5", size, !color ? "opacity-80" : "")}
		></p>
	);
};

// Helper function remains the same
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

const Template2 = ({}) => {
	const { store } = useStore();
	const { template } = useTemplateStore();
	const t = useTranslations();
	const locale = useLocale();

	const localeIso = React.useMemo(
		() => LOCALES.find((lang) => lang.value === locale)?.iso || "en-US",
		[locale]
	);

	// --- Settings (Keep defaults logic) ---
	const colorSettingsDefault = {
		h1Color: template.h1Color === "" ? "#1f2937" : template.h1Color, // Darker gray default
		h2Color: template.h2Color === "" ? "#374151" : template.h2Color, // Medium gray default
		h3Color: template.h3Color === "" ? "#4b5563" : template.h3Color, // Lighter gray default
		textColor: template.textColor === "" ? "#374151" : template.textColor, // Default text color
		descriptionColor:
			template.descriptionColor === "" ? "" : template.descriptionColor, // Keep default empty to trigger opacity
		hyperLinkColor:
			template.hyperLinkColor === "" ? "#0ea5e9" : template.hyperLinkColor, // Brighter blue default
	};

	const fontSettingsDefault = {
		fontFamily: template.fontFamily === "" ? uiSans : template.fontFamily,
		// Slightly adjusted font sizes for better hierarchy
		h1FontSize: handleFindStyle(
			template.h1FontSize,
			"text-lg xs:text-xl", // Small
			"text-2xl xs:text-3xl", // Large
			"text-xl xs:text-2xl" // Default
		),
		h2FontSize: handleFindStyle(
			template.h2FontSize,
			"text-sm xs:text-base", // Small
			"text-lg xs:text-xl", // Large
			"text-base xs:text-lg" // Default
		),
		h3FontSize: handleFindStyle(
			template.h3FontSize,
			"text-sm xs:text-base", // Small (matches default H2 small)
			"text-base xs:text-lg", // Large (matches default H2 default)
			"text-sm xs:text-base font-semibold" // Default (added font-semibold)
		),
		textFontSize: handleFindStyle(
			template.textFontSize,
			"text-xs xs:text-sm", // Small
			"text-sm xs:text-base", // Large
			"text-xs xs:text-sm leading-relaxed" // Default (added leading-relaxed)
		),
		hyperLinkFontSize: handleFindStyle(
			template.hyperLinkFontSize,
			"text-xs xs:text-sm", // Small
			"text-sm xs:text-base", // Large
			"text-xs xs:text-sm" // Default
		),
		descriptionFontSize: handleFindStyle(
			template.descriptionFontSize,
			"text-xs", // Small
			"text-sm xs:text-base", // Large
			"text-xs xs:text-sm leading-relaxed" // Default (added leading-relaxed)
		),
	};

	const sectionSettingsDefault = {
		imageSize: template.imageSize === "" ? 80 : template.imageSize,
		spaceBetween: handleFindStyle(
			template.spaceBetween,
			"mt-3", // Less space
			"mt-6", // More space
			"mt-4" // Default space
		),
		align: handleFindStyle(
			template.align,
			"text-left",
			"text-right",
			"text-left" // Default to left align
		),
		titleCase: handleFindStyle(
			template.titleCase,
			"lowercase",
			"normal-case", // Default normal case now
			"uppercase" // Keep uppercase as an option
		),
		projectLink: template.projectLink || "icon", // Default to icon for links
	};

	// Helper to get alignment classes for flex items
	const getAlignmentClass = (baseClass = "") => {
		return cn(baseClass, {
			"items-start text-left": sectionSettingsDefault.align === "text-left",
			"items-end text-right": sectionSettingsDefault.align === "text-right",
			"items-start text-left":
				sectionSettingsDefault.align !== "text-left" &&
				sectionSettingsDefault.align !== "text-right", // Default case
		});
	};
	const getJustifyClass = (baseClass = "") => {
		return cn(baseClass, {
			"justify-start": sectionSettingsDefault.align === "text-left",
			"justify-end": sectionSettingsDefault.align === "text-right",
			"justify-start":
				sectionSettingsDefault.align !== "text-left" &&
				sectionSettingsDefault.align !== "text-right", // Default case
		});
	};

	return (
		<div
			style={{
				fontFamily: fontSettingsDefault.fontFamily,
				color: colorSettingsDefault.textColor, // Set base text color globally
			}}
			// Increased overall padding, adjusted width slightly if needed (A4 paper width is approx 210mm, US Letter 216mm)
			className="w-[210mm] min-h-[280mm] bg-white my-0 mx-auto p-10 rounded shadow-lg overflow-x-hidden overflow-y-visible"
		>
			{/* --- Header Section --- */}
			<header
				className={cn(
					`flex items-center gap-6 mb-6 pb-4 border-b`, // Increased gap, margin, padding; added border
					{
						"flex-row-reverse": sectionSettingsDefault.align === "text-right",
						"flex-row": sectionSettingsDefault.align !== "text-right",
					}
				)}
				style={{ borderColor: colorSettingsDefault.h2Color + "50" }} // Lighter border
			>
				{store.image && (
					<Image
						src={store.image}
						height={sectionSettingsDefault.imageSize}
						width={sectionSettingsDefault.imageSize}
						alt={t("Personal")}
						className="rounded-full flex-shrink-0" // Prevent shrinking
					/>
				)}
				<div className={cn("flex flex-col w-full", getAlignmentClass())}>
					<h1
						style={{ color: colorSettingsDefault.h1Color }}
						className={cn(
							`w-full font-bold`, // Removed uppercase default
							sectionSettingsDefault.align,
							fontSettingsDefault.h1FontSize
						)}
					>
						{store.general.name} {store.general.surname}
					</h1>
					<h2
						style={{ color: colorSettingsDefault.h2Color }}
						className={cn(
							"w-full font-semibold mt-0.5", // Added small top margin
							sectionSettingsDefault.align,
							fontSettingsDefault.h2FontSize
						)}
					>
						{store.general.jobTitle}
					</h2>
					{/* Contact Info - slightly smaller, more muted */}
					<p
						style={{ color: colorSettingsDefault.textColor }}
						className={cn(
							"w-full mt-1.5 opacity-90", // Increased margin, subtle opacity
							fontSettingsDefault.textFontSize,
							sectionSettingsDefault.align
						)}
					>
						{store.general.city && store.general.city}
						{store.general.country &&
							`${store.general.city ? ", " : ""} ${store.general.country}`}
						{/* Email Link */}
						{store.general.email && (
							<>
								{(store.general.city || store.general.country) && " • "}
								<a
									className={cn(
										"hover:underline",
										fontSettingsDefault.hyperLinkFontSize
									)}
									style={{ color: colorSettingsDefault.hyperLinkColor }}
									target="_blank"
									rel="noopener noreferrer"
									href={`mailto:${store.general.email}`}
								>
									{store.general.email}
								</a>
							</>
						)}
						{/* Phone Link */}
						{store.general.phone && (
							<>
								{(store.general.city ||
									store.general.country ||
									store.general.email) &&
									" • "}
								<a
									className={cn(
										"hover:underline",
										fontSettingsDefault.hyperLinkFontSize
									)}
									style={{ color: colorSettingsDefault.hyperLinkColor }}
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
			</header>

			{/* --- Summary Section (if exists) --- */}
			{store.summary && store.summary !== "<p><br></p>" && (
				<Section
					id="summary"
					title={t("Summary")}
					color={colorSettingsDefault.h2Color}
					size={fontSettingsDefault.h2FontSize}
					align={sectionSettingsDefault.align}
					titleCase={sectionSettingsDefault.titleCase}
					space={"mb-6"} // Use margin bottom instead of space prop here
					className="px-0" // No extra padding needed if main container has it
				>
					<p
						dangerouslySetInnerHTML={{ __html: store.summary }}
						style={{ color: colorSettingsDefault.textColor }}
						className={cn(
							fontSettingsDefault.textFontSize, // Use text font size
							sectionSettingsDefault.align,
							"opacity-90" // Slightly less prominent than titles
						)}
					></p>
				</Section>
			)}

			{/* --- Main Content Grid --- */}
			{/* Adjusted grid columns for maybe slightly wider left col, increased gap */}
			<div className="grid grid-cols-[30%_65%] gap-8 mt-0 w-full justify-between">
				{/* --- Left Column --- */}
				<div className="flex flex-col gap-y-6">
					{" "}
					{/* Consistent gap between sections */}
					{Object.values(store.socialLinks || {}).some((link) => link) && (
						<Section
							id="socials"
							title={t("Social")}
							color={colorSettingsDefault.h2Color}
							size={fontSettingsDefault.h2FontSize}
							align={sectionSettingsDefault.align}
							titleCase={sectionSettingsDefault.titleCase}
							// space={sectionSettingsDefault.spaceBetween} // Removed, handled by parent gap
						>
							{/* Changed to vertical list for cleaner look */}
							<div
								className={cn(
									"flex flex-col w-full gap-1.5",
									getAlignmentClass()
								)}
							>
								{Object.keys(store.socialLinks).map((key) => {
									const social = SOCIALS.find(
										(e) => e.name.toLowerCase() === key
									);
									if (social && store.socialLinks[key]) {
										const rawPart = store.socialLinks[key];
										const url =
											rawPart.startsWith("http://") ||
											rawPart.startsWith("https://")
												? rawPart
												: `https://${rawPart}`;
										// Simplified username extraction (might need refinement based on edge cases)
										const username = url
											.split("/")
											.filter(Boolean)
											.pop()
											?.replace(/[?#].*/, ""); // Remove query params/fragments

										return (
											<a
												href={url}
												target="_blank"
												rel="noopener noreferrer"
												key={key}
												className={cn(
													"flex items-center gap-2 group", // Added group for potential hover effects
													fontSettingsDefault.hyperLinkFontSize
												)}
												style={{ color: colorSettingsDefault.hyperLinkColor }}
											>
												<span className="opacity-90 group-hover:opacity-100 transition-opacity">
													{React.cloneElement(social.logo, { size: 16 })}{" "}
													{/* Standardize icon size */}
												</span>
												<span className="hover:underline">
													{username || key}
												</span>{" "}
												{/* Fallback to key name */}
											</a>
										);
									}
									return null;
								})}
							</div>
						</Section>
					)}
					{store.skills?.length > 0 && (
						<Section
							id="skills"
							title={t("Skills")}
							color={colorSettingsDefault.h2Color}
							size={fontSettingsDefault.h2FontSize}
							align={sectionSettingsDefault.align}
							titleCase={sectionSettingsDefault.titleCase}
							// space={sectionSettingsDefault.spaceBetween}
						>
							<div
								className={cn(
									`w-full flex flex-wrap gap-1.5 print-exact`, // Slightly increased gap
									getJustifyClass() // Use helper for justify content
								)}
							>
								{store.skills?.map((e, index) => (
									<span
										key={index}
										style={{
											backgroundColor:
												colorSettingsDefault.hyperLinkColor + "20", // Lighter background
											color: colorSettingsDefault.hyperLinkColor, // Text color matches link color
										}}
										className={cn(
											"px-2.5 py-1 rounded-md text-xs font-medium", // Adjusted padding/size/weight
											fontSettingsDefault.textFontSize // Ensure consistency if needed
										)}
									>
										{e}
									</span>
								))}
							</div>
						</Section>
					)}
					{store.references?.length > 0 && (
						<Section
							id="references"
							title={t("References")}
							color={colorSettingsDefault.h2Color}
							size={fontSettingsDefault.h2FontSize}
							align={sectionSettingsDefault.align}
							titleCase={sectionSettingsDefault.titleCase}
							// space={sectionSettingsDefault.spaceBetween}
						>
							<div className="flex flex-col w-full gap-3">
								{" "}
								{/* Gap between references */}
								{store.references.map((ref, index) => (
									<div
										key={index}
										className={cn("flex flex-col w-full", getAlignmentClass())}
									>
										<h3
											className={cn(
												`font-semibold`,
												fontSettingsDefault.h3FontSize // Use H3 size
											)}
											style={{ color: colorSettingsDefault.h3Color }}
										>
											<span>{ref.name}</span>
											{ref.company && (
												<span className="font-normal opacity-80 text-sm">
													, {ref.company}
												</span>
											)}
										</h3>
										{/* Contact Info for Reference */}
										<div
											className={cn(
												`flex flex-col mt-0.5`, // Small margin top
												getAlignmentClass(),
												fontSettingsDefault.textFontSize // Use base text size
											)}
										>
											{ref.email && (
												<a
													className={cn(
														"hover:underline",
														fontSettingsDefault.hyperLinkFontSize
													)}
													target="_blank"
													rel="noopener noreferrer"
													href={`mailto:${ref.email}`}
													style={{ color: colorSettingsDefault.hyperLinkColor }}
												>
													{ref.email}
												</a>
											)}
											{ref.phone && (
												<a
													className={cn(
														"hover:underline",
														fontSettingsDefault.hyperLinkFontSize
													)}
													target="_blank"
													rel="noopener noreferrer"
													href={`tel:${ref.phone}`}
													style={{ color: colorSettingsDefault.hyperLinkColor }}
												>
													{ref.phone}
												</a>
											)}
										</div>
									</div>
								))}
							</div>
						</Section>
					)}
					{store.languages?.length > 0 && (
						<Section
							id="languages"
							title={t("Languages")}
							color={colorSettingsDefault.h2Color}
							size={fontSettingsDefault.h2FontSize}
							align={sectionSettingsDefault.align}
							titleCase={sectionSettingsDefault.titleCase}
							// space={sectionSettingsDefault.spaceBetween}
						>
							<div className="flex flex-col w-full gap-2">
								{" "}
								{/* Gap between languages */}
								{store.languages.map((lang, index) => (
									<div
										key={index}
										className={cn("flex flex-col w-full", getAlignmentClass())}
									>
										<h3
											className={cn(
												"font-semibold",
												fontSettingsDefault.h3FontSize // Use H3 size
											)}
											style={{ color: colorSettingsDefault.h3Color }}
										>
											{lang.language}
										</h3>
										<p
											style={{ color: colorSettingsDefault.textColor }}
											className={cn(
												"whitespace-nowrap opacity-80", // Muted level text
												fontSettingsDefault.textFontSize
											)}
										>
											{t(`${lang.level}`)}
										</p>
									</div>
								))}
							</div>
						</Section>
					)}
					{store.interests?.length > 0 && (
						<Section
							id="interests"
							title={t("Interests")}
							color={colorSettingsDefault.h2Color}
							size={fontSettingsDefault.h2FontSize}
							align={sectionSettingsDefault.align}
							titleCase={sectionSettingsDefault.titleCase}
							// space={sectionSettingsDefault.spaceBetween}
						>
							<p
								style={{ color: colorSettingsDefault.textColor }}
								className={cn(
									"w-full opacity-90", // Slightly muted
									fontSettingsDefault.textFontSize,
									sectionSettingsDefault.align
								)}
							>
								{store.interests.join(" · ")}{" "}
								{/* Use interpunct for separation */}
							</p>
						</Section>
					)}
				</div>

				{/* --- Right Column --- */}
				<div className="flex flex-col gap-y-6">
					{" "}
					{/* Consistent gap between sections */}
					{store.experience?.length > 0 && (
						<Section
							id="experience"
							title={t("Experience")}
							color={colorSettingsDefault.h2Color}
							size={fontSettingsDefault.h2FontSize}
							align={sectionSettingsDefault.align}
							titleCase={sectionSettingsDefault.titleCase}
							// space={sectionSettingsDefault.spaceBetween}
						>
							<div className="flex flex-col w-full gap-4">
								{" "}
								{/* Gap between experiences */}
								{store.experience.map((exp, index) => (
									<div
										key={index}
										className="flex flex-col w-full text-left print-break-inside-avoid"
									>
										<div className="flex items-center justify-between w-full flex-wrap">
											<h3
												className={cn(
													"font-semibold",
													fontSettingsDefault.h3FontSize
												)}
												style={{ color: colorSettingsDefault.h3Color }}
											>
												{exp.jobTitle}
											</h3>
											{/* Date Range - slightly smaller, muted */}
											<p
												style={{ color: colorSettingsDefault.textColor }}
												className={cn(
													"text-xs opacity-70 whitespace-nowrap ml-2",
													fontSettingsDefault.textFontSize
												)}
											>
												{useFormattedTime(exp.startDate, localeIso)} -{" "}
												{exp.endDate
													? useFormattedTime(exp.endDate, localeIso)
													: t("Present")}
											</p>
										</div>
										{/* Company & Location */}
										<h4
											style={{ color: colorSettingsDefault.textColor }}
											className={cn(
												"font-normal me-auto opacity-90 mt-0.5", // Small margin top
												fontSettingsDefault.textFontSize // Use smaller text size
											)}
										>
											{exp.company}
											{exp.city && `, ${exp.city}`}
										</h4>
										<Description
											color={colorSettingsDefault.descriptionColor}
											size={fontSettingsDefault.descriptionFontSize}
											state={exp.description}
										/>
									</div>
								))}
							</div>
						</Section>
					)}
					{store.education?.length > 0 && (
						<Section
							id="education"
							title={t("Education")}
							color={colorSettingsDefault.h2Color}
							size={fontSettingsDefault.h2FontSize}
							align={sectionSettingsDefault.align}
							titleCase={sectionSettingsDefault.titleCase}
							// space={sectionSettingsDefault.spaceBetween}
						>
							<div className="flex flex-col w-full gap-4">
								{" "}
								{/* Gap between educations */}
								{store.education.map((edu, index) => (
									<div
										key={index}
										className="flex flex-col w-full text-left print-break-inside-avoid"
									>
										<div className="flex items-center justify-between w-full flex-wrap">
											<h3
												className={cn(
													"font-semibold",
													fontSettingsDefault.h3FontSize
												)}
												style={{ color: colorSettingsDefault.h3Color }}
											>
												{/* Combined degree and field */}
												{edu.degree}
												{edu.fieldOfStudy && ` - ${edu.fieldOfStudy}`}
											</h3>
											<p
												style={{ color: colorSettingsDefault.textColor }}
												className={cn(
													"text-xs opacity-70 whitespace-nowrap ml-2",
													fontSettingsDefault.textFontSize
												)}
											>
												{useFormattedTime(edu.startDate, localeIso)} -{" "}
												{edu.endDate
													? useFormattedTime(edu.endDate, localeIso)
													: t("Present")}
											</p>
										</div>
										{/* Institution & Location */}
										<h4
											style={{ color: colorSettingsDefault.textColor }}
											className={cn(
												"font-normal me-auto opacity-90 mt-0.5",
												fontSettingsDefault.textFontSize
											)}
										>
											{edu.institution}
											{edu.city && `, ${edu.city}`}
										</h4>
										<Description
											color={colorSettingsDefault.descriptionColor}
											size={fontSettingsDefault.descriptionFontSize}
											state={edu.description}
										/>
									</div>
								))}
							</div>
						</Section>
					)}
					{store.projects?.length > 0 && (
						<Section
							id="projects"
							title={t("Projects")}
							color={colorSettingsDefault.h2Color}
							size={fontSettingsDefault.h2FontSize}
							align={sectionSettingsDefault.align}
							titleCase={sectionSettingsDefault.titleCase}
							// space={sectionSettingsDefault.spaceBetween}
						>
							<div className="flex flex-col w-full gap-4">
								{" "}
								{/* Gap between projects */}
								{store.projects.map((project, index) => (
									<div
										key={index}
										className="flex flex-col w-full text-left print-break-inside-avoid"
									>
										<div className="flex items-center justify-between w-full flex-wrap">
											<h3
												className={cn(
													"font-semibold",
													fontSettingsDefault.h3FontSize
												)}
												style={{ color: colorSettingsDefault.h3Color }}
											>
												{project.title}
											</h3>
											{/* Project Links */}
											<div className="flex items-center gap-2 ml-2">
												{project.liveLink && (
													<a
														target="_blank"
														rel="noopener noreferrer"
														href={
															project.liveLink.startsWith("http")
																? project.liveLink
																: `https://${project.liveLink}`
														}
														className={cn(
															"flex items-center gap-1 hover:underline",
															fontSettingsDefault.hyperLinkFontSize
														)}
														style={{
															color: colorSettingsDefault.hyperLinkColor,
														}}
														aria-label={`${project.title} Live Link`}
													>
														{sectionSettingsDefault.projectLink === "icon" ? (
															<MdArrowOutward size={14} />
														) : (
															t("Projects.live")
														)}
													</a>
												)}
												{project.liveLink && project.githubLink && (
													<span className="opacity-40 text-xs">|</span> // Subtle separator
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
														className={cn(
															"flex items-center gap-1 hover:underline",
															fontSettingsDefault.hyperLinkFontSize
														)}
														style={{
															color: colorSettingsDefault.hyperLinkColor,
														}}
														aria-label={`${project.title} Github Link`}
													>
														{sectionSettingsDefault.projectLink === "icon" ? (
															<SiGithub size={13} /> // Slightly smaller GitHub icon
														) : (
															t("Projects.github")
														)}
													</a>
												)}
											</div>
										</div>
										{/* Technologies Used */}
										{project?.technologies?.length > 0 && (
											<p
												style={{ color: colorSettingsDefault.textColor }}
												className={cn(
													"text-left mt-0.5 opacity-80", // Small margin, slightly muted
													fontSettingsDefault.textFontSize
												)}
											>
												<span
													className={cn(
														"font-medium opacity-100",
														fontSettingsDefault.textFontSize
													)}
													style={{ color: colorSettingsDefault.h3Color }} // Use H3 color for label
												>
													{t("Projects.tech")}:
												</span>{" "}
												{project.technologies.join(", ")}
											</p>
										)}
										<Description
											color={colorSettingsDefault.descriptionColor}
											size={fontSettingsDefault.descriptionFontSize}
											state={project.description}
										/>
									</div>
								))}
							</div>
						</Section>
					)}
					{store.certificates?.length > 0 && (
						<Section
							id="certificates"
							title={t("Certificates")}
							color={colorSettingsDefault.h2Color}
							size={fontSettingsDefault.h2FontSize}
							align={sectionSettingsDefault.align}
							titleCase={sectionSettingsDefault.titleCase}
							// space={sectionSettingsDefault.spaceBetween}
						>
							<div className="flex flex-col w-full gap-4">
								{" "}
								{/* Gap between certificates */}
								{store.certificates.map((certificate, index) => (
									<div
										key={index}
										className="flex flex-col w-full text-left print-break-inside-avoid"
									>
										<div className="flex items-center justify-between w-full flex-wrap">
											<h3
												className={cn(
													"font-semibold",
													fontSettingsDefault.h3FontSize
												)}
												style={{ color: colorSettingsDefault.h3Color }}
											>
												{certificate.title}
											</h3>
											<p
												style={{ color: colorSettingsDefault.textColor }}
												className={cn(
													"text-xs opacity-70 whitespace-nowrap ml-2",
													fontSettingsDefault.textFontSize
												)}
											>
												{useFormattedTime(certificate.date, localeIso)}
											</p>
										</div>
										<Description
											color={colorSettingsDefault.descriptionColor}
											size={fontSettingsDefault.descriptionFontSize}
											state={certificate.description}
										/>
									</div>
								))}
							</div>
						</Section>
					)}
				</div>
			</div>
		</div>
	);
};

export default Template2;
