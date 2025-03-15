import React, { useState } from "react";
import { useTranslations } from "next-intl";
import CustomLink from "@/components/common/CustomLink";
import Modal from "@/components/shared/Modal";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

const Stepper = ({ prev, next, prevTitle, nextTitle }) => {
	const t = useTranslations("Steps");
	const [modal, setModal] = useState(false);
	const STEPS = [
		{ id: "personal", label: "Personal Information", value: 1 },
		{ id: "social", label: "Social Links", value: 2 },
		{ id: "summary", label: "Summary", value: 3 },
		{ id: "experience", label: "Experience", value: 4 },
		{ id: "education", label: "Education", value: 5 },
		{ id: "skills", label: "Skills", value: 5 },
		{ id: "projects", label: "Projects", value: 6 },
		{ id: "languages", label: "Languages", value: 7 },
		{ id: "certificates", label: "Certificates", value: 8 },
		{ id: "interests", label: "Interests", value: 9 },
		{ id: "references", label: "References", value: 10 },
	];
	const toggleModal = () => {
		setModal(!modal);
	};
	return (
		<nav className="flex items-center gap-2 mt-2">
			{prev && (
				<CustomLink
					prev={true}
					className__children="hidden xs:block translate-x-4 group-hover:translate-x-0"
					className__animation="xs:translate-x-5  group-hover:xs:translate-x-0 xs:opacity-0"
					href={prev}
					shallow={true}
					replace
					animation={true}
				>
					{prevTitle ? prevTitle : t("prev")}
				</CustomLink>
			)}
			<button
				onClick={toggleModal}
				type="button"
				className="bg-brand hover:bg-brand/90 animation-all p-1 rounded-full text-black"
			>
				<PiDotsThreeOutlineFill />
			</button>
			<Modal isOpen={modal} onClose={toggleModal}>
				<CustomLink
					className__children="-translate-x-3 group-hover:translate-x-0"
					className__animation="-translate-x-5  group-hover:translate-x-0 opacity-0"
					animation={true}
					href={`/`}
				/>
				{STEPS.map((step, index) => (
					<CustomLink
						className__children="-translate-x-3 group-hover:translate-x-0"
						className__animation="-translate-x-5  group-hover:translate-x-0 opacity-0"
						animation={true}
						key={index}
						href={`/build?step=${step.value}`}
					>
						{step.label}
					</CustomLink>
				))}
			</Modal>
			{next && (
				<CustomLink
					className__children="hidden xs:block -translate-x-3 group-hover:translate-x-0"
					className__animation="xs:-translate-x-5  group-hover:xs:translate-x-0 xs:opacity-0"
					href={next}
					shallow={true}
					replace
					animation={true}
				>
					{nextTitle ? nextTitle : t("next")}
				</CustomLink>
			)}
		</nav>
	);
};

export default Stepper;
