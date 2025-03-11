import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Hero from "./components/layout/Hero";
import BuildPage from "./components/build/BuildPage";
import SignUp from "./components/auth/SignUp";
import "./App.css";

function App() {
	return (
		<Router key="router">
			<div className="min-h-screen bg-white text-gray-900">
				<header className="bg-white border-b border-gray-100 py-4">
					<div className="container mx-auto px-4 flex justify-between items-center">
						<h1 className="text-2xl font-bold text-main">Resume Builder</h1>
						<nav>
							<ul className="flex space-x-4">
								<li>
									<Link
										to="/"
										className="px-4 py-2 hover:text-main"
										data-section="home"
									>
										Home
									</Link>
								</li>
								<li>
									<Link
										to="/signup"
										className="px-4 py-2 hover:text-main"
										data-section="build"
									>
										Build
									</Link>
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
					</Routes>
				</main>

				<footer className="bg-gray-50 border-t border-gray-100 py-8">
					<div className="container mx-auto px-4 text-center text-gray-600">
						<p>
							© {new Date().getFullYear()} Resume Builder. All rights reserved.
						</p>
					</div>
				</footer>

				<Toaster position="bottom-right" />
			</div>
		</Router>
	);
}

export default App;
