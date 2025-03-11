import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Hero from "./components/layout/Hero";
import BuildPage from "./components/build/BuildPage";
import SignUp from "./components/auth/SignUp";
import Social from "./components/build/Social";
import Skills from "./components/build/Skills";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  
  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="bg-white border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-main">Resume Builder</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button 
                  className={`px-4 py-2 ${currentPage === "home" ? "text-main font-medium" : "text-gray-600"}`}
                  onClick={() => handleNavigate("home")}
                  data-section="home"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  className={`px-4 py-2 ${currentPage === "build" ? "text-main font-medium" : "text-gray-600"}`}
                  onClick={() => handleNavigate("signup")}
                  data-section="build"
                >
                  Build
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentPage === "home" && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 sm:gap-8 p-6 relative">
            <Hero />
          </div>
        )}
        
        {currentPage === "signup" && <SignUp onNavigate={handleNavigate} />}
        
        {currentPage === "build" && <BuildPage />}
      </main>

      <footer className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Resume Builder. All rights reserved.</p>
        </div>
      </footer>
      
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
