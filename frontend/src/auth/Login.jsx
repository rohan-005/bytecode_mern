import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import { IconTerminal, IconLock, IconMail, IconEye, IconEyeOff, IconLoader2, IconAlertTriangle } from "@tabler/icons-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    const loadingToast = toast.loading("Authenticating user session...");

    const result = await login(email, password);

    if (result.success) {
      toast.dismiss(loadingToast);
      toast.success("Authentication successful! Loading dashboard...", {
        duration: 2000,
        icon: "⚡",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } else {
      toast.dismiss(loadingToast);
      toast.error(result.message || "Login failed. Invalid credentials.");
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-[#FFFFFF] flex items-center justify-center p-6 font-outfit grid-bg">
      <div className="max-w-lg w-full">
        {/* Terminal Window Header */}
        <div className="bg-[#252422] border border-[#4A4A4A] border-b-0 px-5 py-3.5 flex items-center justify-between font-jetbrains">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#FF4D4F] inline-block"></span>
            <span className="w-3 h-3 bg-[#FFC300] inline-block"></span>
            <span className="w-3 h-3 bg-[#35C759] inline-block"></span>
            <span className="text-xs text-[#8E8E8E] font-mono ml-2">[AUTH_TERMINAL_V2]</span>
          </div>
          <span className="text-xs text-[#FF6A2A] font-bold tracking-wider uppercase bg-[#FF6A2A]/10 px-2.5 py-1 border border-[#FF6A2A]/30">
            SECURE ACCESS
          </span>
        </div>

        {/* Card Body */}
        <div className="bg-[#303030] border border-[#4A4A4A] p-10 shadow-2xl relative font-outfit">
          {/* Header Branding */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src={logo}
                alt="ByteCode Logo"
                className="w-24 h-24 object-contain filter drop-shadow-[0_0_16px_rgba(255,106,42,0.45)]"
              />
            </div>
            <h2 className="text-4xl font-bebas text-[#FFFFFF] tracking-wide mb-1">
              WELCOME BACK, DEVELOPER
            </h2>
            <p className="text-sm text-[#CFCFCF] font-mono">Sign in to your ByteCode account</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-[#FF4D4F]/10 border border-[#FF4D4F] text-[#FF4D4F] text-sm flex items-center gap-3">
              <IconAlertTriangle size={20} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-[#CFCFCF] uppercase tracking-wider mb-2 font-mono">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  className="bytecode-input w-full pl-12 pr-4 text-base py-3.5"
                  placeholder="developer@bytecode.dev"
                />
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E8E8E]">
                  <IconMail size={20} />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-[#CFCFCF] uppercase tracking-wider mb-2 font-mono">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  className="bytecode-input w-full pl-12 pr-12 text-base py-3.5"
                  placeholder="••••••••••••"
                />
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E8E8E]">
                  <IconLock size={20} />
                </div>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8E8E8E] hover:text-[#FF6A2A] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bytecode-btn-primary w-full text-base py-3.5 mt-3"
            >
              {loading ? (
                <>
                  <IconLoader2 size={20} className="animate-spin text-white" />
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <IconTerminal size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center mt-8 pt-6 border-t border-[#4A4A4A]">
            <Link
              to="/forgot-password"
              className="text-sm text-[#FF8C42] hover:text-[#FF6A2A] font-semibold transition-colors hover:underline block mb-3 font-mono"
            >
              Forgot your password?
            </Link>
            <p className="text-sm text-[#8E8E8E]">
              New to ByteCode?{" "}
              <Link
                to="/register"
                className="text-[#FF6A2A] hover:text-[#FF8C42] font-bold transition-colors hover:underline ml-1"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
