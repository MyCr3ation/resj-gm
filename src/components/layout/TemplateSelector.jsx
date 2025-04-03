import React from "react";
import template2 from "../../assets/templates/template2.webp";
import useTemplateStore from "@/store/template.jsx";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

const TemplateSelector = ({ onClose }) => {
	const { setTemplate } = useTemplateStore();
	const t = useTranslations("Template");

	const handleTemplateSelect = (templateNumber) => {
		setTemplate("templateNumber", templateNumber);
		toast.success(
			t("templateSuccess", {
				number: templateNumber,
			})
		);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white p-6 rounded-lg w-full max-w-4xl mx-4">
				<h2 className="text-2xl font-bold mb-4">Select Template</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div
						className="cursor-pointer hover:shadow-lg transition-shadow p-4 border rounded-lg"
						onClick={() => handleTemplateSelect(1)}
					>
						<img
							src="../src/assets/templates/template1.webp"
							alt="Template 1"
							className="w-full h-auto"
						/>
						<p className="text-center mt-2 font-semibold">Template 1</p>
					</div>
					<div
						className="cursor-pointer hover:shadow-lg transition-shadow p-4 border rounded-lg"
						onClick={() => handleTemplateSelect(2)}
					>
						<img
							src="../src/assets/templates/template2.webp"
							alt="Template 2"
							className="w-full h-auto"
						/>
						<p className="text-center mt-2 font-semibold">Template 2</p>
					</div>
				</div>
				<div className="flex justify-end mt-4">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default TemplateSelector;
