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
import { FaAngleDown } from "react-icons/fa6";
import ViewJournal from "./components/pages/ViewJournal";

function App() {
	const currentYear = new Date().getFullYear();

	return (
		<Router key="router">
			<div className="w-screen h-screen overflow-x-hidden bg-white text-gray-900 flex flex-col">
				<header className="bg-white border-b border-gray-100 py-4 w-full">
					<div className="px-4 flex justify-between items-center ">
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
						<nav>
							<ul className="flex space-x-4">
								<li>
									<NavLink
										to="/"
										className={({ isActive }) =>
											`px-4 py-2 hover:text-brand no-underline item-center ${
												isActive ? "text-brand font-semibold" : ""
											}`
										}
										data-section="home"
										end // This ensures that only the exact "/" path is active
									>
										Home
									</NavLink>
								</li>
								<li className="relative group">
									<NavLink
										to="/journal"
										onClick={(e) => e.preventDefault()} // Prevent Journal from being clickable
										className={({ isActive }) =>
											`px-4 py-2 hover:text-brand no-underline item-center ${
												isActive ? "text-brand font-semibold" : ""
											}`
										}
										data-section="journal"
									>
										Journal
										<FaAngleDown className="inline ml-1" />
									</NavLink>
									<div className="absolute left-0 right-0 mx-auto mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block transition-opacity duration-300 delay-150">
										<div className="py-1">
											<NavLink
												to="/journal/view"
												className={({ isActive }) =>
													`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline ${
														isActive ? "bg-gray-100" : ""
													}`
												}
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
											>
												New Entry
											</NavLink>
										</div>
									</div>
								</li>
								<li>
									<NavLink
										to="/signup"
										className={({ isActive }) =>
											`px-2 py-2 hover:text-brand no-underline item-center ${
												isActive ? "text-brand font-semibold" : ""
											}`
										}
										data-section="resume"
									>
										Resume
									</NavLink>
								</li>

								{/* <li className="relative group">
									<NavLink className="px-4 py-2 hover:text-brand flex items-center no-underline">
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
									</NavLink>
									<div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
										<div className="py-1">
											<NavLink
												to="/journal"
												className={({ isActive }) =>
													`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline ${
														isActive ? "bg-gray-100" : ""
													}`
												}
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
											>
												New Entry
											</NavLink>
										</div>
									</div>
								</li> */}
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
