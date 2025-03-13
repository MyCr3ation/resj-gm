import {
	HashRouter as Router,
	Routes,
	Route,
	Link,
	NavLink,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Hero from "./components/layout/Hero";
import BuildPage from "./components/build/BuildPage";
import SignUp from "./components/auth/SignUp";
import JournalPage from "./components/journal/JournalPage";
import "./App.css";

function App() {
	const currentYear = new Date().getFullYear();

	return (
		<Router key="router">
			<div className="min-h-screen bg-white text-gray-900">
				<header className="bg-white border-b border-gray-100 py-4">
					<div className="container mx-auto px-4 flex justify-between items-center">
						<h1 className="text-2xl font-bold text-main">Resume Builder</h1>
						<nav>
							<ul className="flex space-x-4">
								<li>
									<NavLink
										to="/"
										className={({ isActive }) =>
											`px-4 py-2 hover:text-main ${
												isActive ? "text-main font-semibold" : ""
											}`
										}
										data-section="home"
										end // This ensures that only the exact "/" path is active
									>
										Home
									</NavLink>
								</li>
								<li>
									<NavLink
										to="/signup"
										className={({ isActive }) =>
											`px-4 py-2 hover:text-main ${
												isActive ? "text-main font-semibold" : ""
											}`
										}
										data-section="build"
									>
										Build
									</NavLink>
								</li>
								<li className="relative group">
									<div className="px-4 py-2 hover:text-main flex items-center cursor-pointer">
										Journal
										<svg
											className="w-3 h-3 ml-1"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</div>
									<div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
										<div className="py-1">
											<NavLink
												to="/journal"
												className={({ isActive }) =>
													`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
														isActive ? "bg-gray-100" : ""
													}`
												}
											>
												View Journal
											</NavLink>
											<NavLink
												to="/journal/new"
												className={({ isActive }) =>
													`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
														isActive ? "bg-gray-100" : ""
													}`
												}
											>
												New Entry
											</NavLink>
										</div>
									</div>
								</li>
							</ul>
						</nav>
					</div>
				</header>

				<main className="container mx-auto px-4 py-8">
					<Routes>
						<Route
							path="/"
							element={
								<div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 sm:gap-8 p-6 relative">
									<Hero />
								</div>
							}
						/>
						<Route path="/signup" element={<SignUp />} />
						<Route path="/resume" element={<BuildPage />} />
						<Route path="/journal/*" element={<JournalPage />} />{" "}
						{/* Handle nested routes */}
					</Routes>
				</main>

				<footer className="bg-gray-50 border-t border-gray-100 py-8">
					<div className="container mx-auto px-4 text-center text-gray-600">
						<p>© {currentYear} Resume Builder. All rights reserved.</p>
					</div>
				</footer>

				<Toaster position="bottom-right" />
			</div>
		</Router>
	);
}

export default App;
