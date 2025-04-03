import React from "react";
import ImageUpload from "../../components/shared/ImageUpload";
import Input from "../../components/common/Input";
import useStore from "../../store/store.jsx";
// Editor component will be imported directly in Vite
import Editor from "../../components/shared/Editor";

const Personal = () => {
	const { store, setStore } = useStore();

	return (
		<div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
			<h1 className="text-center font-bold text-3xl text-brand mb-4">
				Personal Information
			</h1>
			<div className="flex items-center justify-center">
				<ImageUpload />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Input
					state={store.general.name}
					setState={(value) => setStore("general.name", value)}
					name={"name"}
					label="Name"
				/>
				<Input
					state={store.general.surname}
					setState={(value) => setStore("general.surname", value)}
					name={"surname"}
					label="Surname"
				/>
				<Input
					state={store.general.email}
					setState={(value) => setStore("general.email", value)}
					name={"mail"}
					label="Email"
				/>
				<Input
					state={store.general.phone}
					setState={(value) => setStore("general.phone", value)}
					name={"phone"}
					label="Phone"
				/>
				<Input
					state={store.general.jobTitle}
					setState={(value) => setStore("general.jobTitle", value)}
					name={"jobtitle"}
					label="Job Title"
				/>
				<Input
					state={store.general.driving}
					setState={(value) => setStore("general.driving", value)}
					name={"drivingLicense"}
					label="Driving License"
				/>
				<Input
					state={store.general.country}
					setState={(value) => setStore("general.country", value)}
					name={"country"}
					label="Country"
				/>
				<Input
					state={store.general.city}
					setState={(value) => setStore("general.city", value)}
					name={"city"}
					label="City"
				/>
			</div>
		</div>
	);
};

export default Personal;
