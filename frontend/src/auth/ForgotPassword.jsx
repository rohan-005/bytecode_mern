import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { IconMail, IconKey, IconLock, IconLoader2, IconRefresh } from "@tabler/icons-react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
    resetToken: ""
  });
  const [loading, setLoading] = useState(false);

  const { email, otp, password, confirmPassword } = formData;
  const { 
    forgotPassword, 
    verifyPasswordResetOTP, 
    resetPassword, 
    resendPasswordResetOTP 
  } = useAuth();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Requesting OTP verification code...");

    try {
      const result = await forgotPassword(email);
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(result.message || "OTP sent to your email!");
        setStep(2);
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Network error. Please try again.");
      console.error('Request failed:', error);
    }

    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Verifying security OTP...");

    try {
      const result = await verifyPasswordResetOTP(email, otp);
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(result.message || "OTP verified successfully!");
        setFormData(prev => ({ 
          ...prev, 
          resetToken: result.resetToken 
        }));
        setStep(3);
      } else {
        toast.error(result.message || "Invalid OTP");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Network error. Please try again.");
      console.error('Request failed:', error);
    }

    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Resetting account password...");

    try {
      const result = await resetPassword(formData.resetToken, password);
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(result.message || "Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        toast.error(result.message || "Failed to reset password");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Network error. Please try again.");
      console.error('Request failed:', error);
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    const loadingToast = toast.loading("Resending OTP token...");

    try {
      const result = await resendPasswordResetOTP(email);
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(result.message || "OTP resent successfully!");
      } else {
        toast.error(result.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Network error. Please try again.");
      console.error('Request failed:', error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#2F3437] text-[#F5F7F5] flex items-center justify-center p-4 font-jetbrains grid-bg">
      <div className="max-w-md w-full">
        {/* Terminal Header */}
        <div className="bg-[#3A4044] border border-[#626A6E] border-b-0 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#E53935] inline-block"></span>
            <span className="w-3 h-3 bg-[#FBC02D] inline-block"></span>
            <span className="w-3 h-3 bg-[#66BB6A] inline-block"></span>
            <span className="text-xs text-[#AAB2AD] font-mono ml-2">[PASSWORD_RECOVERY]</span>
          </div>
          <span className="text-[10px] text-[#66BB6A] font-bold tracking-wider uppercase bg-[#66BB6A]/10 px-2 py-0.5 border border-[#66BB6A]/30">
            STEP {step}/3
          </span>
        </div>

        {/* Card Body */}
        <div className="bg-[#454C50] border border-[#626A6E] p-8 shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <img
                src={logo}
                alt="ByteCode Logo"
                className="w-16 h-16 object-contain filter drop-shadow-[0_0_12px_rgba(102,187,106,0.3)]"
              />
            </div>
            <h2 className="text-3xl font-bebas text-[#F5F7F5] tracking-wide mb-1">
              RESET PASSWORD
            </h2>
            <p className="text-xs text-[#D5DBD6] font-mono">
              {step === 1 && "Enter registered email to receive OTP token"}
              {step === 2 && `Enter 6-digit code sent to ${email}`}
              {step === 3 && "Construct your new secure password"}
            </p>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#D5DBD6] uppercase tracking-wider mb-2">
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#AAB2AD]">
                    <IconMail size={18} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bytecode-btn-primary w-full"
              >
                {loading ? (
                  <>
                    <IconLoader2 size={18} className="animate-spin text-white" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <IconKey size={18} />
                    <span>Send Security OTP</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#D5DBD6] uppercase tracking-wider mb-2">
                  Verification Code (OTP)
                </label>
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={onChange}
                  maxLength={6}
                  required
                  className="bytecode-input w-full text-center text-2xl tracking-[0.5em] font-mono"
                  placeholder="000000"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="bytecode-btn-secondary flex-1"
                >
                  <IconRefresh size={16} />
                  <span>Resend</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bytecode-btn-primary flex-1"
                >
                  {loading ? (
                    <>
                      <IconLoader2 size={18} className="animate-spin text-white" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify Code</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#D5DBD6] uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    className="bytecode-input w-full pl-10 pr-4"
                    placeholder="••••••••••••"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#AAB2AD]">
                    <IconLock size={18} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D5DBD6] uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={onChange}
                    required
                    className="bytecode-input w-full pl-10 pr-4"
                    placeholder="••••••••••••"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#AAB2AD]">
                    <IconLock size={18} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bytecode-btn-primary w-full mt-2"
              >
                {loading ? (
                  <>
                    <IconLoader2 size={18} className="animate-spin text-white" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-[#626A6E] text-center">
            <p className="text-xs text-[#AAB2AD]">
              Remember your credentials?{" "}
              <Link
                to="/login"
                className="text-[#66BB6A] hover:text-[#A5D6A7] font-semibold transition-colors hover:underline ml-1"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;