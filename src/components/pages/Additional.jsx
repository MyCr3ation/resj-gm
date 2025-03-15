import React from "react";
import Certificates from "@/components/pages/Certificates";
import Interests from "@/components/pages/Interests";
import References from "@/components/pages/References";
import Languages from "@/components/pages/Languages";
import Stepper from "@/components/layout/Stepper";
import { useTranslations } from "next-intl";

const Additional = () => {
	const t = useTranslations("Additional");
	return (
		<div className="my-14 lg:my-20 px-10 flex flex-col gap-2">
			<h1 className="text-center font-bold text-3xl text-brand mb-4">
				{t("title")}
			</h1>
			<Certificates />
			<Interests />
			<References />
			<Languages />
			{/* <Stepper prev={`/build?step=6`} /> */}
		</div>
	);
};

export default Additional;
