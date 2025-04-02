import {
	HashRouter as Router,
	Routes,
	Route,
	Link,
	NavLink,
	Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Hero from "./components/layout/Hero";
import BuildPage from "./components/pages/BuildPage";
import SignUp from "./components/auth/SignUp";
import Journal from "./components/pages/Journal";
import Logo from "../src/resj-logo-color.svg";
import { FaAngleDown, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa"; // Import FaSignOutAlt
import ViewJournal from "./components/pages/ViewJournal";
import FullJournalView from "./components/journal/FullJournalViewContainer";
import EditJournal from "./components/pages/EditJournal";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast"; // Import toast

function App() {
	const currentYear = new Date().getFullYear();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loadingAuth, setLoadingAuth] = useState(true);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleLogout = async () => {
		try {
			const response = await axios.post(
				"https://resj-gm-1.onrender.com/api/logout" ||
					"http://localhost:5500/api/logout",
				{
					withCredentials: true,
				}
			);

			if (response.status === 200) {
				setIsAuthenticated(false); // Update authentication status
				toast.success("Logged out successfully!");
				// No need to manually navigate here; the NavLinks will handle redirection
			} else {
				toast.error("Logout failed"); // Show error toast
			}
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Logout failed"); // Show error toast
		}
	};

	useEffect(() => {
		const checkAuth = async () => {
			setLoadingAuth(true);
			try {
				const response = await axios.get(
					"https://resj-gm-1.onrender.com/api/protected" ||
						"http://localhost:5500/api/protected",
					{
						withCredentials: true,
					}
				);
				if (response.status === 200) {
					setIsAuthenticated(true);
				} else {
					setIsAuthenticated(false);
				}
			} catch (error) {
				console.log("User not authenticated", error);
				setIsAuthenticated(false);
			} finally {
				setLoadingAuth(false);
			}
		};

		checkAuth();
	}, []);

	return (
		<Router key="router">
			<div className="w-screen h-screen overflow-x-hidden bg-white text-gray-900 flex flex-col">
				<header className="bg-white border-b border-gray-100  w-full">
					<div className="px-4 flex justify-between items-center">
						<Link to="/" className="flex items-center ">
							<img
								src={Logo}
								alt="Resume Builder Logo"
								className="h-24 w-24 "
							/>
						</Link>

						<div className="flex items-center">
							{/* Mobile Menu Button */}
							<button
								className="md:hidden text-brand focus:outline-none"
								onClick={toggleMenu}
							>
								{isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
							</button>
						</div>

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
										end
									>
										Home
									</NavLink>
								</li>
								<li className="relative group pb-2">
									<NavLink
										to={isAuthenticated ? "/journal" : "/signup"}
										onClick={(e) => {
											if (!isAuthenticated && window.innerWidth < 768) {
												toggleMenu();
											}
										}}
										className={({ isActive }) =>
											`px-4 py-2 hover:text-brand no-underline item-center block ${
												isActive
													? isAuthenticated
														? "text-brand font-semibold"
														: ""
													: ""
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
												to={isAuthenticated ? "/journal/view" : "/signup"}
												className={({ isActive }) =>
													`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline ${
														isActive
															? isAuthenticated
																? "bg-gray-100"
																: ""
															: ""
													}`
												}
												onClick={toggleMenu}
											>
												View Journal
											</NavLink>
											<NavLink
												to={isAuthenticated ? "/journal/new" : "/signup"}
												className={({ isActive }) =>
													`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline ${
														isActive
															? isAuthenticated
																? "bg-gray-100"
																: ""
															: ""
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
										to={isAuthenticated ? "/resume" : "/signup"}
										className={({ isActive }) =>
											`px-2 py-2 hover:text-brand no-underline item-center block ${
												isActive
													? isAuthenticated
														? "text-brand font-semibold"
														: ""
													: ""
											}`
										}
										data-section="resume"
										onClick={toggleMenu}
									>
										Resume
									</NavLink>
								</li>
								{/* Mobile Logout Button */}
								{isAuthenticated && (
									<li className="relative group pb-2">
										<NavLink
											to="/"
											onClick={handleLogout}
											className="px-4 py-2 hover:text-brand no-underline item-center block"
										>
											<FaSignOutAlt className="inline mr-1" />
											Logout
										</NavLink>
									</li>
								)}
							</ul>
						</nav>
					</div>
				</header>

				<main className="flex-1 px-6 py-8">
					{loadingAuth ? (
						<div>Loading...</div>
					) : (
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
							<Route
								path="/resume"
								element={
									isAuthenticated ? <BuildPage /> : <Navigate to="/signup" />
								}
							/>
							<Route
								path="/journal/new"
								element={
									isAuthenticated ? <Journal /> : <Navigate to="/signup" />
								}
							/>
							<Route
								path="/journal/view"
								element={
									isAuthenticated ? <ViewJournal /> : <Navigate to="/signup" />
								}
							/>
							<Route
								path="/journal/view/:journalId"
								element={
									isAuthenticated ? (
										<FullJournalView />
									) : (
										<Navigate to="/signup" />
									)
								}
							/>
							<Route
								path="/journal/edit/:journalId"
								element={
									isAuthenticated ? (
										<EditJournal />
									) : (
										<Navigate to="/signup" replace />
									)
								}
							/>
							<Route
								path="/journal"
								element={
									isAuthenticated ? (
										<Navigate to="/journal/view" />
									) : (
										<Navigate to="/signup" />
									)
								}
							/>
						</Routes>
					)}
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
