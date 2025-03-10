import React, { useState } from "react";
import { SOCIALS } from "../../utils/constants.jsx";
import useStore from "../../store/store.jsx";

const Social = () => {
	const { store, setStore } = useStore();
	const { socialLinks } = store;
	const [activeTab, setActiveTab] = useState("linkedin");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setStore(`socialLinks.${name}`, value);
	};

	return (
		<div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
			<h2 className="text-2xl font-semibold mb-6">Social Links</h2>

			<div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
				{SOCIALS.map((item) => (
					<button
						key={item.name.toLowerCase()}
						className={`px-3 py-2 rounded-t-md text-sm font-medium flex items-center gap-2 ${
							activeTab === item.name.toLowerCase()
								? "bg-main text-white"
								: "hover:bg-gray-100"
						}`}
						onClick={() => setActiveTab(item.name.toLowerCase())}
					>
						{item.logo} {item.name}
					</button>
				))}
			</div>

			<div className="mt-4">
				{SOCIALS.map((item) => {
					const name = item.name.toLowerCase();
					return (
						<div key={name} className={activeTab === name ? "block" : "hidden"}>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								{item.name} Profile URL or Username
							</label>
							<div className="flex items-center">
								<span className="text-xl mr-2">{item.logo}</span>
								<input
									type="text"
									name={name}
									value={socialLinks[name] || ""}
									onChange={handleChange}
									placeholder={`Your ${item.name} username or profile URL`}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
								/>
							</div>

							{name === "linkedin" && (
								<p className="text-sm text-gray-500 mt-1">
									Example: username or https://linkedin.com/in/username
								</p>
							)}
							{name === "github" && (
								<p className="text-sm text-gray-500 mt-1">
									Example: username or https://github.com/username
								</p>
							)}
							{name === "website" && (
								<p className="text-sm text-gray-500 mt-1">
									Example: https://yourwebsite.com
								</p>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Social;
