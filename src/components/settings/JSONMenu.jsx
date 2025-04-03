// JSONMenu.jsx
import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import useStore from "@/store/store";
import { copyToClipboard } from "@/utils/helpers";
import Button from "@/components/common/Button"; // <-- Import new Button
import { MdKeyboardArrowLeft } from "react-icons/md";
import {
	VscJson,
	VscCopy,
	VscCloudDownload,
	VscFolderOpened,
	VscCheck,
} from "react-icons/vsc"; // Import icons
import { cn } from "@/utils/helpers";

// Simple Textarea component for consistency (Optional, but helps)
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
	return (
		<textarea
			className={cn(
				"flex min-h-[80px] w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 ring-offset-back placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brandGreen-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			ref={ref}
			{...props}
		/>
	);
});
Textarea.displayName = "Textarea";

const JSONMenu = ({ setSettingTab, action }) => {
	const { importDataFromFile, store } = useStore((state) => ({
		importDataFromFile: state.importDataFromFile,
		store: state, // Get the whole store state for export
	}));
	const [jsonInput, setJsonInput] = useState("");
	const [copied, setCopied] = useState(false);
	const t = useTranslations("Template");
	const fileInputRef = useRef(null);

	// Get current resume data state for export (excluding meta like version)
	const exportData = store; // Export the raw store data
	const stringData = JSON.stringify(exportData, null, 2); // Pretty print

	//* Import resume data from file
	const handleFileImport = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (file.type === "application/json") {
			try {
				const reader = new FileReader();
				reader.onload = async (e) => {
					try {
						const text = e.target?.result;
						const parsedData = JSON.parse(text);
						await importDataFromFile(parsedData); // Pass the parsed object
						toast.success(t("importSuccess"));
						setSettingTab("main"); // Go back after import
					} catch (parseError) {
						console.error("JSON Parsing Error:", parseError);
						toast.error(t("invalidJson"));
					}
				};
				reader.onerror = () => {
					console.error("File Reading Error:", reader.error);
					toast.error(t("fileReadError")); // Add translation
				};
				reader.readAsText(file);
			} catch (error) {
				console.error("Import Error:", error);
				toast.error(t("error")); // Generic error
			}
		} else {
			toast.error(t("invalidFileType")); // Add translation for wrong file type
		}
		// Reset file input value so the same file can be selected again
		if (event.target) {
			event.target.value = null;
		}
	};

	// Import from text area
	const handleTextImport = async () => {
		if (!jsonInput.trim()) {
			toast.error(t("jsonInputEmpty")); // Add translation
			return;
		}
		try {
			const parsedData = JSON.parse(jsonInput);
			await importDataFromFile(parsedData); // Pass the parsed object
			toast.success(t("importSuccess"));
			setSettingTab("main"); // Go back after import
		} catch (error) {
			console.error("JSON Parsing/Import Error:", error);
			toast.error(t("invalidJson"));
		}
	};

	//* Export resume data
	const handleDownload = () => {
		try {
			const blob = new Blob([stringData], { type: "application/json" });
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = "resume-data.json";
			document.body.appendChild(link); // Required for Firefox
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(link.href);
			toast.success(t("exportSuccess"));
		} catch (error) {
			console.error("Download Error:", error);
			toast.error(t("error"));
		}
	};

	const handleCopy = () => {
		copyToClipboard(stringData);
		setCopied(true);
		toast.success(t("copied"));
		setTimeout(() => setCopied(false), 2000); // Reset icon after 2s
	};

	// Trigger hidden file input click
	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="flex flex-col gap-3 p-2">
			{" "}
			{/* Added padding and gap */}
			<Button
				variant="ghost"
				size="sm"
				onClick={() => setSettingTab("main")}
				className="justify-start px-2 text-zinc-400 hover:text-zinc-100" // Align left
			>
				<MdKeyboardArrowLeft size={20} /> {t("back")}
			</Button>
			{action === "import" ? (
				<>
					{/* Import from File Button */}
					<div className="px-2">
						<Button
							variant="outline" // Use outline for file selection
							size="sm"
							onClick={triggerFileInput}
							className="w-full"
						>
							<VscFolderOpened className="mr-2" /> {t("jsonImportFile")}{" "}
							{/* Add translation */}
						</Button>
						<input
							id="importFile"
							ref={fileInputRef}
							type="file"
							onChange={handleFileImport}
							accept=".json,application/json"
							className="hidden"
						/>
					</div>

					{/* "Or" Divider */}
					<div className="relative px-2">
						<div
							className="absolute inset-0 flex items-center"
							aria-hidden="true"
						>
							<div className="w-full border-t border-zinc-700" />
						</div>
						<div className="relative flex justify-center">
							<span className="bg-zinc-800 px-2 text-xs text-zinc-400">
								{t("or")}
							</span>
						</div>
					</div>

					{/* Import from Text Area */}
					<div className="flex flex-col gap-2 px-2">
						<label
							htmlFor="import-json-textarea"
							className="text-xs font-medium text-zinc-400"
						>
							{t("pasteJson")} {/* Add translation */}
						</label>
						<Textarea
							id="import-json-textarea"
							value={jsonInput}
							onChange={(e) => setJsonInput(e.target.value)}
							placeholder={t("jsonPlaceholder")} // Add translation
							rows={6} // Adjust rows as needed
						/>
						<Button
							variant="primary"
							size="sm"
							onClick={handleTextImport}
							disabled={!jsonInput.trim()}
						>
							{t("import")}
						</Button>
					</div>
				</>
			) : (
				// Export Action
				<>
					{/* Download Button */}
					<div className="px-2">
						<Button
							variant="primary"
							size="sm"
							onClick={handleDownload}
							className="w-full"
						>
							<VscCloudDownload className="mr-2" /> {t("jsonExportDownload")}{" "}
							{/* Add translation */}
						</Button>
					</div>

					{/* "Or" Divider */}
					<div className="relative px-2">
						<div
							className="absolute inset-0 flex items-center"
							aria-hidden="true"
						>
							<div className="w-full border-t border-zinc-700" />
						</div>
						<div className="relative flex justify-center">
							<span className="bg-zinc-800 px-2 text-xs text-zinc-400">
								{t("or")}
							</span>
						</div>
					</div>

					{/* Copy JSON Area */}
					<div className="flex flex-col gap-2 px-2">
						<label
							htmlFor="export-json-textarea"
							className="text-xs font-medium text-zinc-400"
						>
							{t("copyJson")} {/* Add translation */}
						</label>
						<div className="relative">
							<Textarea
								id="export-json-textarea"
								value={stringData || ""} // Handle case where data might be null initially
								readOnly
								rows={8} // Adjust rows as needed
							/>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleCopy}
								className="absolute top-2 right-2 h-7 w-7 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700" // Position copy button
								aria-label={t("copy")}
							>
								{copied ? <VscCheck size={16} /> : <VscCopy size={16} />}
							</Button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default JSONMenu;
