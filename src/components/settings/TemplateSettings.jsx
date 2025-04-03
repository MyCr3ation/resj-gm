import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import useStore from "@/store/store";
import useTemplateStore from "@/store/template";
import { Menu } from "@/components/settings/Menu";
import Button from "@/components/common/Button";
import MainMenu from "@/components/settings/MainMenu";
import ColorMenu from "@/components/settings/ColorMenu";
import SectionMenu from "@/components/settings/SectionMenu";
import FontMenu from "@/components/settings/FontMenu";
import Settings from "@/components/settings/Settings";
import JSONMenu from "@/components/settings/JSONMenu";
import MarginMenu from "@/components/settings/MarginMenu";
import { MdSaveAlt } from "react-icons/md";
import { FaPaintBrush } from "react-icons/fa";
import { RiSettings3Fill } from "react-icons/ri";
import { TbWindowMaximize, TbWindowMinimize } from "react-icons/tb";
import { cn } from "@/utils/helpers";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Directly import your templates
import Template1 from "@/components/templates/Template1";
import Template2 from "@/components/templates/Template2";

const TemplateSettings = ({ openReview, show, setTemplateModal }) => {
	const { template, setTemplate } = useTemplateStore();
	const [tabMenu, setTabMenu] = useState("main");
	const [settingTab, setSettingTab] = useState("main");
	const { name, surname } = useStore();
	const t = useTranslations("Template");

	// Create a ref for the hidden container that will render the template
	const pdfRef = useRef(null);

	// Function to conditionally render the template based on template.templateNumber
	const renderTemplate = () => {
		switch (template.templateNumber) {
			case 1:
				return <Template1 />;
			case 2:
				return <Template2 />;
			default:
				return <Template1 />;
		}
	};

	// PDF download handler that uses the hidden container
	const handleDownloadPdf = async () => {
		try {
			const element = pdfRef.current;
			if (!element) {
				console.error("Hidden PDF element not found!");
				return;
			}
			// Capture the hidden element as a canvas
			const canvas = await html2canvas(element, {
				scale: 2,
				useCORS: true,
			});
			const imgData = canvas.toDataURL("image/png");

			// Create a new PDF instance
			const pdf = new jsPDF("p", "mm", "a4");
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
			pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
			pdf.save("template.pdf");
		} catch (error) {
			console.error("Error generating PDF:", error);
			toast.error(t("errorGeneratingPDF"));
		}
	};

	// Memoized menu content, reset functions, etc., remain unchanged
	const customizeMenuContent = React.useMemo(
		() => ({
			main: (
				<MainMenu
					setTabMenu={setTabMenu}
					reset={() => {
						// your resetAll function here
					}}
					setTemplateModal={setTemplateModal}
				/>
			),
			sections: (
				<SectionMenu
					setTabMenu={setTabMenu}
					reset={() => {
						// your resetSections function here
					}}
					templateNumber={template.templateNumber}
				/>
			),
			colors: (
				<ColorMenu
					setTabMenu={setTabMenu}
					reset={() => {
						// your resetColors function here
					}}
				/>
			),
			fonts: (
				<FontMenu
					setTabMenu={setTabMenu}
					reset={() => {
						// your resetFonts function here
					}}
				/>
			),
			margin: <MarginMenu setTabMenu={setTabMenu} />,
		}),
		[tabMenu, template.templateNumber, setTabMenu, setTemplateModal]
	);

	const settingsMenuContent = React.useMemo(
		() => ({
			main: <Settings setSettingTab={setSettingTab} />,
			import: <JSONMenu setSettingTab={setSettingTab} action="import" />,
			export: <JSONMenu setSettingTab={setSettingTab} action="export" />,
		}),
		[settingTab, setSettingTab]
	);

	return (
		<>
			<div
				className={cn(
					"my-4 flex flex-col xs:flex-row items-center justify-center gap-2 sticky top-0 print:hidden z-50"
				)}
			>
				{/* PDF Download Button in TemplateSettings */}
				<Button onClick={handleDownloadPdf} variant="primary" size="default">
					{t("Download PDF")}
					<MdSaveAlt size={16} className="mr-1.5" />
				</Button>

				{/* Other buttons/menus */}
				{/* <Menu
					label={t("Customize")}
					icon={<FaPaintBrush size={14} />}
					buttonVariant="default"
					buttonSize="default"
				>
					{customizeMenuContent[tabMenu] || customizeMenuContent["main"]}
				</Menu> */}
				<Menu
					label={t("Settings")}
					icon={<RiSettings3Fill size={14} />}
					buttonVariant="default"
					buttonSize="default"
				>
					{settingsMenuContent[settingTab] || settingsMenuContent["main"]}
				</Menu>
				{/* <Button
					variant="default"
					size="default"
					className="hidden xl:inline-flex py-2"
					onClick={openReview}
					label={show ? t("Minimize Preview") : t("Maximize Preview")}
				>
					{!show ? (
						<TbWindowMaximize size={16} className="rotate-[270deg]" />
					) : (
						<TbWindowMinimize size={16} className="rotate-[270deg]" />
					)}
				</Button> */}
			</div>

			{/* Hidden container rendering the chosen template for PDF generation */}
			<div
				style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
				ref={pdfRef}
			>
				{renderTemplate()}
			</div>
		</>
	);
};

export default TemplateSettings;
