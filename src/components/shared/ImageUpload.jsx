import React, { useEffect, useState } from "react";
import useStore from "@/store/store";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import ImageCrop from "@/components/shared/ImageCrop";
import { useTranslations } from "next-intl";

const ImageUpload = () => {
	const {
		store: { image },
		setStore,
	} = useStore();
	const t = useTranslations("Personal");
	const [imagePreview, setImagePreview] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);

	const handleImageChange = async (e) => {
		const file = e.target.files[0];

		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64String = reader.result;
				setImagePreview(base64String);
				setModalOpen(true);
			};
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		if (image !== null) {
			setImagePreview(image);
		}
	}, [image]);

	const deleteImage = () => {
		if (window.confirm(t("remove"))) {
			setStore("image", null);
			setImagePreview(null);
		}
	};

	const onCropDone = (imgCroppedArea) => {
		const canvasElement = document.createElement("canvas");
		canvasElement.width = imgCroppedArea.width;
		canvasElement.height = imgCroppedArea.height;
		const context = canvasElement.getContext("2d");

		const imageObj = new Image();
		imageObj.src = imagePreview;
		imageObj.onload = function () {
			context.drawImage(
				imageObj,
				imgCroppedArea.x,
				imgCroppedArea.y,
				imgCroppedArea.width,
				imgCroppedArea.height,
				0,
				0,
				imgCroppedArea.width,
				imgCroppedArea.height
			);
			const dataURL = canvasElement.toDataURL("image/jpeg");
			// Directly update the store with the cropped image
			setStore("image", dataURL);
		};
		setModalOpen(false);
		setImagePreview(null);
	};

	return (
		<div className="flex flex-col items-center">
			<div className="w-20 h-20 relative">
				{image ? (
					<img
						src={image}
						alt="Uploaded"
						loading="lazy"
						className="w-full h-full object-cover rounded-full"
					/>
				) : (
					<div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
						<span className="select-none text-gray-900 text-xs">80 x 80</span>
					</div>
				)}
				{image && (
					<button
						onClick={deleteImage}
						type="button"
						className="absolute top-0 right-0 bg-red-400 text-black rounded-full p-1"
					>
						<MdDelete />
					</button>
				)}
			</div>
			<ImageCrop
				image={imagePreview}
				open={modalOpen}
				onCropCancel={() => setModalOpen(false)}
				onCropDone={onCropDone}
			/>
			<div className="flex items-center justify-center gap-2 my-2">
				<label
					htmlFor="dropzone-file"
					className="flex flex-col items-center justify-center w-full cursor-pointer"
				>
					<IoCloudUploadOutline size={20} className="text-black" />
					<input
						id="dropzone-file"
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleImageChange}
					/>
				</label>
			</div>
		</div>
	);
};

export default ImageUpload;
