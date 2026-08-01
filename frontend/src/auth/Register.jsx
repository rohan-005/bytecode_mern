import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import logo from "../assets/logo.png";
import { IconUser, IconMail, IconLock, IconEye, IconEyeOff, IconLoader2, IconAlertTriangle, IconUserPlus } from '@tabler/icons-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Please enter your full name');
      return false;
    }

    if (!email) {
      toast.error('Please enter your email address');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    const loadingToast = toast.loading('Initializing new account registration...');

    const result = await register(name, email, password);

    if (result.success) {
      toast.dismiss(loadingToast);
      toast.success('Account created! Please verify your email via OTP. 📧', {
        duration: 4000,
        icon: '⚡'
      });
      
      localStorage.setItem('pendingVerificationEmail', email);
      setTimeout(() => {
        navigate('/verify-email', { state: { email } });
      }, 1500);
    } else {
      toast.dismiss(loadingToast);
      toast.error(result.message || 'Registration failed. Please try again.');
      setError(result.message);
    }

    setLoading(false);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, color: 'bg-[#4A4A4A]', text: '' };
    if (password.length < 6) return { strength: 33, color: 'bg-[#FF4D4F]', text: 'Weak' };
    if (password.length < 8) return { strength: 66, color: 'bg-[#FFC300]', text: 'Medium' };
    
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (hasNumbers && hasSpecialChars) {
      return { strength: 100, color: 'bg-[#35C759]', text: 'Strong' };
    }
    return { strength: 80, color: 'bg-[#FFC300]', text: 'Good' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-[#FFFFFF] flex items-center justify-center p-4 font-jetbrains grid-bg">
      <div className="max-w-md w-full my-8">
        {/* Terminal Window Header */}
        <div className="bg-[#252422] border border-[#4A4A4A] border-b-0 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#FF4D4F] inline-block"></span>
            <span className="w-3 h-3 bg-[#FFC300] inline-block"></span>
            <span className="w-3 h-3 bg-[#35C759] inline-block"></span>
            <span className="text-xs text-[#8E8E8E] font-mono ml-2">[REGISTER_ACCOUNT]</span>
          </div>
          <span className="text-[10px] text-[#FF6A2A] font-bold tracking-wider uppercase bg-[#FF6A2A]/10 px-2 py-0.5 border border-[#FF6A2A]/30">
            NEW DEVELOPER
          </span>
        </div>

        {/* Card Body */}
        <div className="bg-[#303030] border border-[#4A4A4A] p-8 shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <img
                src={logo}
                alt="ByteCode Logo"
                className="w-16 h-16 object-contain filter drop-shadow-[0_0_12px_rgba(255,106,42,0.4)]"
              />
            </div>
            <h2 className="text-3xl font-bebas text-[#FFFFFF] tracking-wide mb-1">
              JOIN BYTECODE
            </h2>
            <p className="text-xs text-[#CFCFCF] font-mono">Start building and practicing code today</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-[#FF4D4F]/10 border border-[#FF4D4F] text-[#FF4D4F] text-xs flex items-center gap-2">
              <IconAlertTriangle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#CFCFCF] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                  className="bytecode-input w-full pl-10 pr-4"
                  placeholder="Linus Torvalds"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8E8E8E]">
                  <IconUser size={18} />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-[#CFCFCF] uppercase tracking-wider mb-1.5">
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

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#CFCFCF] uppercase tracking-wider mb-1.5">
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
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between text-[11px] text-[#CFCFCF] mb-1 font-mono">
                    <span>Complexity</span>
                    <span className={passwordStrength.text === 'Strong' ? 'text-[#35C759]' : passwordStrength.text === 'Good' ? 'text-[#FFC300]' : 'text-[#FF4D4F]'}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-[#252422] h-1.5 border border-[#4A4A4A]">
                    <div 
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#CFCFCF] uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bytecode-btn-primary w-full mt-4"
            >
              {loading ? (
                <>
                  <IconLoader2 size={18} className="animate-spin text-white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <IconUserPlus size={18} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[#4A4A4A] text-center">
            <p className="text-xs text-[#8E8E8E]">
              Already registered?{" "}
              <Link
                to="/login"
                className="text-[#FF6A2A] hover:text-[#FF8C42] font-semibold transition-colors hover:underline ml-1"
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

export default Register;