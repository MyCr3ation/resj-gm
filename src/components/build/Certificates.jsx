import { useState } from "react";
import useStore from "../../store/store";
import { lazy } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { handleMoveItem, useFormattedTime } from "../../utils/helpers";
import { MdDateRange, MdPlayArrow } from "react-icons/md";
import toast from "react-hot-toast";
// import { useLocale, useTranslations } from "next-intl";
import { LOCALES } from "../../utils/constants";
import Example from "../shared/Example";
import EditorLoading from "../shared/EditorLoading";
const Editor = lazy(() => import("../shared/Editor"));

const Certificates = () => {
	// Simple translation function replacement
	const t = (key) => key;
	const {
		store: { certificates },
		addItem,
		editItem,
		removeItem,
		updateOrder,
	} = useStore();

	const [newCertificate, setNewCertificate] = useState({
		title: "",
		date: "",
		description: "",
	});

	const [editedIndex, setEditedIndex] = useState(null);

	const handleAddCertificate = () => {
		if (newCertificate.title && newCertificate.date) {
			addItem("certificates", newCertificate);
			setNewCertificate({
				title: "",
				date: "",
				description: "",
			});
		} else {
			toast.error(t("error"));
		}
	};

	const handleRemoveCertificate = (index) => {
		removeItem("certificates", index);
	};

	//* Edit
	const handleEditCertificate = () => {
		try {
			editItem("certificates", editedIndex, newCertificate);
			toast.success(t("success"));
			setEditedIndex(null);
			setNewCertificate({
				title: "",
				date: "",
				description: "",
			});
		} catch (error) {
			console.error(error);
			toast.error(error);
		}
	};

	const handleChooseCertificate = (index) => {
		setEditedIndex(index);
		const certificateItem = certificates[index];
		setNewCertificate({
			title: certificateItem.title,
			date: certificateItem.date,
			description: certificateItem.description,
		});
		// Temporary solution
		setTimeout(() => {
			setNewCertificate({
				title: certificateItem.title,
				date: certificateItem.date,
				description: certificateItem.description,
			});
		}, [200]);
	};

	const handleCloseEdit = () => {
		setEditedIndex(null);
		setNewCertificate({
			title: "",
			date: "",
			description: "",
		});
	};

	//* Sort functions
	const handleMoveCertificatesUp = (index) => {
		handleMoveItem(certificates, updateOrder, index, "up", "certificates");
	};

	const handleMoveCertificatesDown = (index) => {
		handleMoveItem(certificates, updateOrder, index, "down", "certificates");
	};

	//* ISO
	// Since useLocale is commented out in imports, we'll use a fallback
	const locale = "en"; // Default to English
	const localeIso =
		LOCALES.find((lang) => lang.value === locale)?.iso || "en-US";

	return (
		<div className="flex flex-col gap-2 border-b border-dashed border-gray-400">
			<h1 className="text-center font-bold text-3xl text-main mb-4">
				Certificates
			</h1>
			<>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Input
						state={newCertificate.title}
						setState={(value) =>
							setNewCertificate({ ...newCertificate, title: value })
						}
						name="title"
						label={t("certificate") + "*"}
					/>
					<Input
						state={newCertificate.date}
						setState={(value) =>
							setNewCertificate({ ...newCertificate, date: value })
						}
						type="month"
						lang={localeIso}
						name="date"
						label={t("date") + "*"}
					/>
				</div>
				<div className="mt-2">
					<Editor
						editedIndex={editedIndex}
						state={newCertificate.description}
						setState={(value) =>
							setNewCertificate({ ...newCertificate, description: value })
						}
						label={t("description")}
					/>
				</div>
				<Button
					onClick={() =>
						editedIndex === null
							? handleAddCertificate()
							: handleEditCertificate()
					}
				>
					{t(editedIndex !== null ? "edit" : "add")}
				</Button>
				{editedIndex !== null && (
					<Button onClick={() => handleCloseEdit()}>{t("close")}</Button>
				)}
				{/* List */}
				<div className="my-6">
					{certificates.length > 0 && (
						<div className="space-y-4 text-white/80">
							{certificates.map((cert, index) => (
								<Example
									key={index}
									index={index}
									remove={handleRemoveCertificate}
									edit={handleChooseCertificate}
									down={handleMoveCertificatesDown}
									up={handleMoveCertificatesUp}
									title={cert.title}
									state={certificates}
								>
									<p className="flex items-center gap-1">
										<strong className="text-main">
											<MdDateRange />
										</strong>{" "}
										{useFormattedTime(cert.date, localeIso)}
									</p>
									<div
										dangerouslySetInnerHTML={{
											__html:
												cert?.description !== "<p><br></p>"
													? cert.description
													: "",
										}}
									></div>
								</Example>
							))}
						</div>
					)}
				</div>
			</>
		</div>
	);
};

export default Certificates;
