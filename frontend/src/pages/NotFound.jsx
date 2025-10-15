import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // replace with your logo path

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-black to-gray-800 text-white text-center px-6">
      {/* Logo */}
      <img
        src={logo}
        alt="Platform Logo"
        className="w-40 h-40 mb-6 "
      />

      {/* 404 Code Styled Header */}
      <h1 className="text-6xl md:text-7xl font-extrabold text-cyan-400 tracking-widest mb-4">
        404
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-gray-300 font-mono mb-8">
        {"<"}Oops! Page not found {"/>"}
      </p>

      {/* Description */}
      <p className="text-gray-400 max-w-md mb-10 leading-relaxed">
        Looks like you’ve reached a broken link in the code.  
        Let’s get you back to a working route!
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
      >
        Back to Home
      </button>

      {/* Decorative code snippet style */}
      
    </div>
  );
};

export default NotFound;
