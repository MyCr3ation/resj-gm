import React from "react";
import { FaArrowRight } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="w-full max-w-5xl flex flex-col items-center gap-6 sm:gap-8">
      <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-green-500 via-main to-emerald-500 bg-clip-text text-transparent animate-glow">
        Resume Builder
      </h1>
      <p className="text-xl md:text-2xl text-center max-w-2xl px-6">
        Create a professional resume in minutes with our easy-to-use builder.
        No sign-up required, free to use, and export-ready.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('button[data-section="build"]')?.click();
          }}
          className="flex items-center justify-center gap-2 w-full sm:w-fit px-6 py-3 bg-main text-white rounded-lg font-medium hover:bg-opacity-90 transition-all"
        >
          Build Resume <FaArrowRight />
        </a>
      </div>
    </div>
  );
};

export default Hero;