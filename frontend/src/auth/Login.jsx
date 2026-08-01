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
    <div className="min-h-screen bg-[#1B1B1B] text-[#FFFFFF] flex items-center justify-center p-4 font-jetbrains grid-bg">
      <div className="max-w-md w-full">
        {/* Terminal Window Header */}
        <div className="bg-[#252422] border border-[#4A4A4A] border-b-0 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#FF4D4F] inline-block"></span>
            <span className="w-3 h-3 bg-[#FFC300] inline-block"></span>
            <span className="w-3 h-3 bg-[#35C759] inline-block"></span>
            <span className="text-xs text-[#8E8E8E] font-mono ml-2">[AUTH_TERMINAL_V2]</span>
          </div>
          <span className="text-[10px] text-[#FF6A2A] font-bold tracking-wider uppercase bg-[#FF6A2A]/10 px-2 py-0.5 border border-[#FF6A2A]/30">
            SECURE ACCESS
          </span>
        </div>

        {/* Card Body */}
        <div className="bg-[#303030] border border-[#4A4A4A] p-8 shadow-2xl relative">
          {/* Header Branding */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <img
                src={logo}
                alt="ByteCode Logo"
                className="w-20 h-20 object-contain filter drop-shadow-[0_0_12px_rgba(255,106,42,0.4)]"
              />
            </div>
            <h2 className="text-3xl font-bebas text-[#FFFFFF] tracking-wide mb-1">
              WELCOME BACK, DEVELOPER
            </h2>
            <p className="text-xs text-[#CFCFCF] font-mono">Sign in to your ByteCode account</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3 bg-[#FF4D4F]/10 border border-[#FF4D4F] text-[#FF4D4F] text-xs flex items-center gap-2">
              <IconAlertTriangle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-[#CFCFCF] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  className="bytecode-input w-full pl-10 pr-4"
                  placeholder="developer@bytecode.dev"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8E8E8E]">
                  <IconMail size={18} />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-[#CFCFCF] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  className="bytecode-input w-full pl-10 pr-10"
                  placeholder="••••••••••••"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8E8E8E]">
                  <IconLock size={18} />
                </div>
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8E8E8E] hover:text-[#FF6A2A] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bytecode-btn-primary w-full mt-2"
            >
              {loading ? (
                <>
                  <IconLoader2 size={18} className="animate-spin text-white" />
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <IconTerminal size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center mt-6 pt-4 border-t border-[#4A4A4A]">
            <Link
              to="/forgot-password"
              className="text-xs text-[#FF8C42] hover:text-[#FF6A2A] font-semibold transition-colors hover:underline block mb-3"
            >
              Forgot your password?
            </Link>
            <p className="text-xs text-[#8E8E8E]">
              New to ByteCode?{" "}
              <Link
                to="/register"
                className="text-[#FF6A2A] hover:text-[#FF8C42] font-semibold transition-colors hover:underline ml-1"
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
