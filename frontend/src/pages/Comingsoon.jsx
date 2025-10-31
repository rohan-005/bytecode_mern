import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // replace with your logo path

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-black to-gray-800 text-white text-center px-6">
      {/* Logo */}
      <img
        src={logo}
        alt="Platform Logo"
        className="w-40 h-40 mb-6"
      />

      {/* Header */}
      <h1 className="text-5xl md:text-7xl font-extrabold text-cyan-400 tracking-widest mb-4">
        Coming Soon
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-gray-300 font-mono mb-8">
        {"<"}Something exciting is in the works...{"/>"}
      </p>

      {/* Description */}
      <p className="text-gray-400 max-w-md mb-10 leading-relaxed">
        We’re building something amazing for you. Stay tuned for updates — this feature is under development and will be live soon!
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
      >
        Back to Home
      </button>

      {/* Decorative line */}
      <div className="mt-12 w-40 h-1 bg-gradient-to-r from-cyan-400 to-transparent rounded-full"></div>
    </div>
  );
};

export default ComingSoon;
