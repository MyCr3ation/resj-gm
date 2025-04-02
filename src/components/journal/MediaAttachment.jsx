import React, { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

const MediaAttachment = ({ handleFileChange }) => {
	const [files, setFiles] = useState([]);

	const handleCombinedFileChange = async (event) => {
		const newFiles = Array.from(event.target.files);

		// Check total size against 500MB limit
		let totalSize = newFiles.reduce((sum, file) => sum + file.size, 0);
		for (let existingFile of files) {
			totalSize += existingFile.size;
		}
		if (totalSize > 500 * 1024 * 1024) {
			alert("Total file size exceeds the limit (500MB).");
			return;
		}

		// Check each file's size (max 100MB)
		for (const file of newFiles) {
			if (file.size > 100 * 1024 * 1024) {
				alert(`File "${file.name}" is too large! Maximum size is 100MB.`);
				return;
			}
		}

		// Upload each file and construct the media object using the returned data
		const uploadedFileData = [];
		for (const file of newFiles) {
			const formData = new FormData();
			formData.append("file", file);

			try {
				const response = await fetch(
					"https://resj-gm.onrender.com/api/upload" ||
						"http://localhost:5500/api/upload",
					{
						method: "POST",
						body: formData,
					}
				);

				if (!response.ok) {
					const errorData = await response.json();
					console.error("Upload failed:", errorData);
					alert(
						`Failed to upload file ${file.name}: ${
							errorData.error || "Unknown error"
						}`
					);
					continue;
				}

				const result = await response.json();
				// Construct the media object. Adjust filePath based on your API's response.
				uploadedFileData.push({
					mediatype: file.type,
					filePath: result.file.path || result.file.filename,
					name: file.name,
					size: file.size,
				});
			} catch (err) {
				console.error("Error uploading file:", err);
				alert(`Error uploading file ${file.name}: ${err.message}`);
			}
		}

		const updatedFiles = [...files, ...uploadedFileData];
		setFiles(updatedFiles);
		handleFileChange(updatedFiles, true);
	};

	const removeFile = (index) => {
		const updatedFiles = [...files];
		updatedFiles.splice(index, 1);
		setFiles(updatedFiles);
		handleFileChange(updatedFiles, true);
	};

	return (
		<div>
			<div className="mb-3">
				<label className="block text-sm font-medium text-gray-700">
					<h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
						Attach Media
						<AiOutlineInfoCircle
							title="Upload photos, videos, or audio clips relevant to your journal (Max 100MB each, 500MB total)"
							className="inline ml-2 cursor-pointer text-brandGreen-400"
						/>
					</h3>
				</label>
				<input
					type="file"
					name="media"
					accept="image/*,video/*,audio/*"
					multiple
					onChange={handleCombinedFileChange}
					className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandGreen-200 focus:border-brandGreen-300 transition-colors"
				/>
			</div>
			{files.length > 0 && (
				<div className="mt-4">
					<h4 className="text-md font-medium text-gray-700 mb-2">
						Uploaded Files:
					</h4>
					<ul>
						{files.map((file, index) => (
							<li
								key={index}
								className="flex items-center justify-between py-2 border-b border-gray-200 last:border-none"
							>
								<span className="text-sm">
									{file.name} ({file.mediatype}) -{" "}
									{(file.size / (1024 * 1024)).toFixed(2)} MB
								</span>
								<button
									type="button"
									onClick={() => removeFile(index)}
									className="px-3 py-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
								>
									Remove
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default MediaAttachment;
