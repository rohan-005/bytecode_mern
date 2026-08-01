/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import logo from "../assets/logo.png";
import { IconShieldCheck, IconLoader2, IconRefresh, IconArrowLeft } from '@tabler/icons-react';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  useEffect(() => {
    const userEmail = location.state?.email || localStorage.getItem('pendingVerificationEmail');
    if (userEmail) {
      setEmail(userEmail);
      localStorage.setItem('pendingVerificationEmail', userEmail);
    } else {
      navigate('/register');
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerifyOTP();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split('').slice(0, 6);
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
      
      if (newOtp.length === 6) {
        inputRefs.current[5].focus();
      } else {
        inputRefs.current[newOtp.length].focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/otp/verify-email', {
        email,
        otp: otpValue
      });

      setMessage('Email verified successfully!');
      toast.success('Email verified successfully! Redirecting...');
      
      localStorage.removeItem('pendingVerificationEmail');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to verify OTP';
      setError(errorMsg);
      toast.error(errorMsg);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      const response = await api.post('/otp/resend-otp', { email });
      setMessage('OTP resent successfully!');
      toast.success(' New OTP sent to your email!');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to resend OTP';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setResendLoading(false);
    }
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
            <span className="text-xs text-[#AAB2AD] font-mono ml-2">[OTP_VERIFICATION]</span>
          </div>
          <span className="text-[10px] text-[#66BB6A] font-bold tracking-wider uppercase bg-[#66BB6A]/10 px-2 py-0.5 border border-[#66BB6A]/30">
            SECURITY CHECK
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
              VERIFY YOUR EMAIL
            </h2>
            <p className="text-xs text-[#D5DBD6] font-mono mb-1">We sent a 6-digit code to</p>
            <p className="text-xs text-[#66BB6A] font-bold font-mono bg-[#2F3437] py-1 px-3 border border-[#626A6E] inline-block">
              {email}
            </p>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-[#66BB6A]/10 border border-[#66BB6A] text-[#66BB6A] text-xs">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-[#E53935]/10 border border-[#E53935] text-[#E53935] text-xs">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-xs font-semibold text-[#D5DBD6] uppercase tracking-wider mb-4 text-center">
              ENTER 6-DIGIT SECURITY CODE
            </label>
            <div className="flex justify-between gap-2 mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  className="w-11 h-12 text-center text-xl font-bold bg-[#2F3437] border border-[#626A6E] text-white focus:border-[#66BB6A] focus:outline-none transition-colors"
                  disabled={loading}
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.join('').length !== 6}
              className="bytecode-btn-primary w-full"
            >
              {loading ? (
                <>
                  <IconLoader2 size={18} className="animate-spin text-white" />
                  <span>Verifying OTP Code...</span>
                </>
              ) : (
                <>
                  <IconShieldCheck size={18} />
                  <span>Verify Email</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center space-y-4 pt-4 border-t border-[#626A6E]">
            <div className="text-xs text-[#AAB2AD]">
              <p>Didn't receive code?</p>
              <button
                onClick={handleResendOTP}
                disabled={resendLoading || countdown > 0}
                className="text-[#66BB6A] hover:text-[#A5D6A7] font-semibold transition-colors disabled:text-[#AAB2AD] disabled:cursor-not-allowed mt-1.5 flex items-center justify-center gap-1 mx-auto"
              >
                {resendLoading ? (
                  <>
                    <IconLoader2 size={14} className="animate-spin" />
                    <span>Resending Code...</span>
                  </>
                ) : countdown > 0 ? (
                  <span>Resend in {countdown}s</span>
                ) : (
                  <>
                    <IconRefresh size={14} />
                    <span>Resend OTP</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => navigate('/register')}
              className="text-xs text-[#D5DBD6] hover:text-[#66BB6A] transition-colors flex items-center justify-center gap-1 mx-auto pt-2"
            >
              <IconArrowLeft size={14} />
              <span>Back to Register</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;