import {
	HashRouter as Router,
	Routes,
	Route,
	Link,
	NavLink,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Hero from "./components/layout/Hero";
import BuildPage from "./components/pages/BuildPage";
import SignUp from "./components/auth/SignUp";
import Journal from "./components/pages/Journal";
import Logo from "../src/resj-logo-color.svg";
import { FaAngleDown, FaBars, FaTimes } from "react-icons/fa"; // Import icons from react-icons/fa
import ViewJournal from "./components/pages/ViewJournal";
import FullJournalView from "./components/pages/FullJournalView";
import { useState } from "react";

function App() {
	const currentYear = new Date().getFullYear();
	const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<Router key="router">
			<div className="w-screen h-screen overflow-x-hidden bg-white text-gray-900 flex flex-col">
				<header className="bg-white border-b border-gray-100  w-full">
					<div className="px-4 flex justify-between items-center">
						<Link
							to="/"
							className="flex items-center font-bold text-brand bg-brand"
						>
							<img
								src={Logo}
								alt="Resume Builder Logo"
								className="h-10 w-auto"
							/>
						</Link>

						{/* Mobile Menu Button */}
						<button
							className="md:hidden text-brand focus:outline-none"
							onClick={toggleMenu}
						>
							{isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
						</button>

						{/* Navigation (hidden on small screens, shown on medium and up) */}
						<nav
							className={`${
								isMenuOpen ? "block" : "hidden"
							} md:block absolute md:static top-full left-0 bg-white md:bg-transparent z-50 md:z-auto shadow-md md:shadow-none`}
						>
							<ul className="flex flex-col md:flex-row md:space-x-4 p-4 md:p-0">
								<li>
									<NavLink
										to="/"
										className={({ isActive }) =>
											`px-4 py-2 hover:text-brand no-underline item-center block ${
												isActive ? "text-brand font-semibold" : ""
											}`
										}
										data-section="home"
										onClick={toggleMenu}
										end // This ensures that only the exact "/" path is active
									>
										Home
									</NavLink>
								</li>
								<li className="relative group pb-2">
									<NavLink
										to="/journal"
										onClick={(e) => {
											e.preventDefault(); // Prevent Journal from being clickable
											if (window.innerWidth < 768) {
												// Check if it's mobile.  768px = md breakpoint
												toggleMenu(); // Close the menu if it's open
											}
										}}
										className={({ isActive }) =>
											`px-4 py-2 hover:text-brand no-underline item-center block ${
												isActive ? "text-brand font-semibold" : ""
											}`
										}
										data-section="journal"
									>
										Journal
										<FaAngleDown className="inline ml-1" />
									</NavLink>
									<div className="absolute left-0 right-0 mx-auto mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block transition-opacity duration-1000 delay-150 md:group-hover:block">
										<div className="py-1">
											<NavLink
												to="/journal/view"
												className={({ isActive }) =>
													`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline ${
														isActive ? "bg-gray-100" : ""
													}`
												}
												onClick={toggleMenu}
											>
												View Journal
											</NavLink>
											<NavLink
												to="/journal/new"
												className={({ isActive }) =>
													`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline ${
														isActive ? "bg-gray-100" : ""
													}`
												}
												onClick={toggleMenu}
											>
												New Entry
											</NavLink>
										</div>
									</div>
								</li>
								<li>
									<NavLink
										to="/resume"
										className={({ isActive }) =>
											`px-2 py-2 hover:text-brand no-underline item-center block ${
												isActive ? "text-brand font-semibold" : ""
											}`
										}
										data-section="resume"
										onClick={toggleMenu}
									>
										Resume
									</NavLink>
								</li>
							</ul>
						</nav>
					</div>
				</header>

				<main className="flex-1 px-6 py-8">
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
						<Route path="/journal/new" element={<Journal />} />
						<Route path="/journal/view" element={<ViewJournal />} />
						<Route path="/journal/view/:id" element={<FullJournalView />} />
					</Routes>
				</main>

				<footer className="bg-gray-50 border-t border-gray-100 py-8 w-full">
					<div className="px-4 text-center text-gray-600">
						<p>© {currentYear} Resume Builder. All rights reserved.</p>
					</div>
				</footer>

				<Toaster position="bottom-right" />
			</div>
		</Router>
	);
}

export default App;
