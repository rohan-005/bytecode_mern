import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { IconTerminal, IconArrowLeft } from "@tabler/icons-react";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#2F3437] text-[#F5F7F5] text-center px-6 font-jetbrains grid-bg">
      <div className="bg-[#454C50] border border-[#626A6E] p-8 max-w-md w-full shadow-2xl relative">
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="ByteCode Logo"
            className="w-20 h-20 object-contain filter drop-shadow-[0_0_12px_rgba(102,187,106,0.3)]"
          />
        </div>

        <h1 className="text-4xl font-bebas text-[#F5F7F5] tracking-wider mb-2">
          FEATURE UNDER DEVELOPMENT
        </h1>

        <p className="text-xs text-[#66BB6A] font-mono mb-4 bg-[#2F3437] p-2 border border-[#626A6E]">
          {"<"}STATUS: FEATURE_DEPLOYMENT_PENDING{"/>"}
        </p>

        <p className="text-xs text-[#D5DBD6] font-mono leading-relaxed mb-6">
          This developer suite module is undergoing final validation and will be available in the upcoming build release.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="bytecode-btn-primary w-full text-xs py-3"
        >
          <IconArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
