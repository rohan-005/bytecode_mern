/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { FloatingNavbar } from "../components/FloatingNavbar";
import { IconUser, IconLock, IconArrowLeft, IconCheck, IconAlertTriangle, IconLoader2, IconShieldLock } from "@tabler/icons-react";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:5000/api');
      const response = await fetch(`${apiBase}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profileForm.name
        })
      });

      const data = await response.json();

      if (response.ok) {
        updateUser(data.user);
        setMessage({ 
          type: "success", 
          text: "Profile information updated successfully!" 
        });
      } else {
        setMessage({ 
          type: "error", 
          text: data.message || "Failed to update profile" 
        });
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: "An error occurred while updating profile" 
      });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ 
        type: "error", 
        text: "New passwords do not match" 
      });
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ 
        type: "error", 
        text: "Password must be at least 6 characters" 
      });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:5000/api');
      const response = await fetch(`${apiBase}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: "success", 
          text: "Password changed successfully!" 
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        setMessage({ 
          type: "error", 
          text: data.message || "Failed to change password" 
        });
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: "An error occurred while changing password" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2F3437] text-[#F5F7F5] font-outfit flex flex-col justify-between">
      <FloatingNavbar />
      {/* Widescreen Container */}
      <div className="w-full max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-16 py-12">
        {/* Navigation Link */}
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#A5D6A7] hover:text-[#66BB6A] uppercase tracking-wider transition-colors font-mono"
          >
            <IconArrowLeft size={18} />
            <span>Return to Dashboard</span>
          </Link>
        </div>

        {/* Header */}
        <div className="bytecode-card p-8 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-[#2F3437] border border-[#66BB6A] flex items-center justify-center font-bebas text-3xl text-[#66BB6A]">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "BC"}
            </div>
            <div>
              <h1 className="text-4xl font-bebas tracking-wide text-[#F5F7F5]">
                ACCOUNT SETTINGS
              </h1>
              <p className="text-sm text-[#AAB2AD] font-mono">
                Developer Profile & Security Preferences
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-[#2F3437] border border-[#626A6E] text-sm font-mono text-[#D5DBD6] self-start md:self-auto">
            UID: <span className="text-[#66BB6A] font-bold">{user?._id || "BYTECODE_USER"}</span>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-8 p-5 border text-sm font-outfit flex items-center gap-3 ${
            message.type === "success" 
              ? "bg-[#66BB6A]/10 border-[#66BB6A] text-[#66BB6A]" 
              : "bg-[#E53935]/10 border-[#E53935] text-[#E53935]"
          }`}>
            {message.type === "success" ? <IconCheck size={20} /> : <IconAlertTriangle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bytecode-card p-3 space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-5 py-4 font-semibold text-sm uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  activeTab === "profile"
                    ? "bg-[#66BB6A] text-[#F5F7F5]"
                    : "bg-[#2F3437] text-[#D5DBD6] hover:text-[#F5F7F5] border border-[#626A6E]"
                }`}
              >
                <IconUser size={18} />
                <span>Profile Info</span>
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`w-full text-left px-5 py-4 font-semibold text-sm uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  activeTab === "password"
                    ? "bg-[#66BB6A] text-[#F5F7F5]"
                    : "bg-[#2F3437] text-[#D5DBD6] hover:text-[#F5F7F5] border border-[#626A6E]"
                }`}
              >
                <IconLock size={18} />
                <span>Security</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bytecode-card p-10">
                <h2 className="text-3xl font-cinzel tracking-wide text-[#F5F7F5] mb-8 pb-3 border-b border-[#626A6E]">
                  PERSONAL INFORMATION
                </h2>
                
                <form onSubmit={updateProfile} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-semibold text-[#D5DBD6] uppercase tracking-wider mb-3 font-mono">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        className="bytecode-input w-full"
                        placeholder="Developer Name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#AAB2AD] uppercase tracking-wider mb-3 font-mono">
                        Email Address (Read-only)
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        className="bytecode-input w-full opacity-60 cursor-not-allowed bg-[#2F3437]"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-5 pt-6 border-t border-[#626A6E]">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bytecode-btn-primary text-base"
                    >
                      {loading ? (
                        <>
                          <IconLoader2 size={18} className="animate-spin text-white" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <span>Save Profile</span>
                      )}
                    </button>

                    <Link
                      to="/dashboard"
                      className="bytecode-btn-secondary text-base"
                    >
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "password" && (
              <div className="bytecode-card p-10">
                <h2 className="text-3xl font-cinzel tracking-wide text-[#F5F7F5] mb-8 pb-3 border-b border-[#626A6E]">
                  CHANGE SECURITY PASSWORD
                </h2>
                
                <form onSubmit={changePassword} className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#D5DBD6] uppercase tracking-wider mb-3 font-mono">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="bytecode-input w-full"
                      placeholder="••••••••••••"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-[#D5DBD6] uppercase tracking-wider mb-3 font-mono">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="bytecode-input w-full"
                        placeholder="••••••••••••"
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#D5DBD6] uppercase tracking-wider mb-3 font-mono">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="bytecode-input w-full"
                        placeholder="••••••••••••"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-5 pt-6 border-t border-[#626A6E]">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bytecode-btn-primary text-base"
                    >
                      {loading ? (
                        <>
                          <IconLoader2 size={18} className="animate-spin text-white" />
                          <span>Changing Password...</span>
                        </>
                      ) : (
                        <>
                          <IconShieldLock size={18} />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;