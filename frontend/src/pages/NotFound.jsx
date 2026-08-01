import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { IconAlertOctagon, IconArrowLeft } from "@tabler/icons-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F1110] text-[#FFFFFF] text-center px-6 font-jetbrains grid-bg">
      <div className="bg-[#1D2420] border border-[#2E3A33] p-8 max-w-md w-full shadow-2xl relative">
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="ByteCode Logo"
            className="w-20 h-20 object-contain filter drop-shadow-[0_0_12px_rgba(255,106,42,0.4)]"
          />
        </div>

        <h1 className="text-6xl font-bebas text-[#E53935] tracking-widest mb-1">
          ERR_404
        </h1>

        <p className="text-xs text-[#66BB6A] font-mono mb-4 bg-[#0F1110] p-2 border border-[#2E3A33]">
          {"<"}ROUTE_NOT_FOUND_EXCEPTION{"/>"}
        </p>

        <p className="text-xs text-[#D7D7D7] font-mono leading-relaxed mb-6">
          The requested endpoint or page path does not exist in the routing table.
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

export default NotFound;
