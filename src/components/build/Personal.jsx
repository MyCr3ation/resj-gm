import React, { useState } from "react";
import useStore from "../../store/store.jsx";
import { cn } from "../../utils/helpers.jsx";

const Personal = () => {
	const { store, setStore } = useStore();
	const { name, surname, email, phone, jobTitle, country, city, driving } =
		store.general;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setStore(`general.${name}`, value);
	};

	return (
		<div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
			<h2 className="text-2xl font-semibold mb-6">Personal Information</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						First Name
					</label>
					<input
						type="text"
						name="name"
						value={name}
						onChange={handleChange}
						placeholder="Your first name"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Last Name
					</label>
					<input
						type="text"
						name="surname"
						value={surname}
						onChange={handleChange}
						placeholder="Your last name"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Email
					</label>
					<input
						type="email"
						name="email"
						value={email}
						onChange={handleChange}
						placeholder="your.email@example.com"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Phone
					</label>
					<input
						type="text"
						name="phone"
						value={phone}
						onChange={handleChange}
						placeholder="Phone number"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Job Title
					</label>
					<input
						type="text"
						name="jobTitle"
						value={jobTitle}
						onChange={handleChange}
						placeholder="e.g. Frontend Developer"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Country
					</label>
					<input
						type="text"
						name="country"
						value={country}
						onChange={handleChange}
						placeholder="Country"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						City
					</label>
					<input
						type="text"
						name="city"
						value={city}
						onChange={handleChange}
						placeholder="City"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Driving License
					</label>
					<input
						type="text"
						name="driving"
						value={driving}
						onChange={handleChange}
						placeholder="e.g. B"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
					/>
				</div>
			</div>
		</div>
	);
};

export default Personal;
