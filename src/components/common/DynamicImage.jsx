import React, { useState } from "react";

const DynamicImage = ({ src, alt }) => {
	const [aspectRatio, setAspectRatio] = useState(1);

	const handleImageLoad = (e) => {
		const { naturalWidth, naturalHeight } = e.target;
		if (naturalHeight !== 0) {
			setAspectRatio(naturalWidth / naturalHeight);
		}
	};

	return (
		<div
			style={{
				aspectRatio: aspectRatio, // Dynamically set container aspect ratio
				overflow: "hidden",
			}}
			className="rounded-lg"
		>
			<img
				src={src}
				alt={alt}
				onLoad={handleImageLoad}
				className="w-full h-full object-cover"
			/>
		</div>
	);
};

export default DynamicImage;
