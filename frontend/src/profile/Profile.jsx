/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
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
    <div className="min-h-screen bg-[#1B1B1B] text-[#FFFFFF] font-jetbrains flex flex-col justify-between">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Navigation Link */}
        <div className="mb-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#FF8C42] hover:text-[#FF6A2A] uppercase tracking-wider transition-colors"
          >
            <IconArrowLeft size={16} />
            <span>Return to Dashboard</span>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-[#303030] border border-[#4A4A4A] p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#252422] border border-[#FF6A2A] flex items-center justify-center font-bebas text-2xl text-[#FF6A2A]">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "BC"}
            </div>
            <div>
              <h1 className="text-3xl font-bebas tracking-wide text-[#FFFFFF]">
                ACCOUNT SETTINGS
              </h1>
              <p className="text-xs text-[#8E8E8E] font-mono">
                Developer Profile & Security Preferences
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-[#252422] border border-[#4A4A4A] text-xs font-mono text-[#CFCFCF] self-start md:self-auto">
            UID: <span className="text-[#FF6A2A]">{user?._id || "BYTECODE_USER"}</span>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 border text-xs flex items-center gap-2 ${
            message.type === "success" 
              ? "bg-[#35C759]/10 border-[#35C759] text-[#35C759]" 
              : "bg-[#FF4D4F]/10 border-[#FF4D4F] text-[#FF4D4F]"
          }`}>
            {message.type === "success" ? <IconCheck size={18} /> : <IconAlertTriangle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-[#303030] border border-[#4A4A4A] p-2 space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  activeTab === "profile"
                    ? "bg-[#FF6A2A] text-[#FFFFFF]"
                    : "bg-[#252422] text-[#CFCFCF] hover:text-[#FFFFFF] border border-[#4A4A4A]"
                }`}
              >
                <IconUser size={16} />
                <span>Profile Info</span>
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`w-full text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider flex items-center gap-3 transition-colors ${
                  activeTab === "password"
                    ? "bg-[#FF6A2A] text-[#FFFFFF]"
                    : "bg-[#252422] text-[#CFCFCF] hover:text-[#FFFFFF] border border-[#4A4A4A]"
                }`}
              >
                <IconLock size={16} />
                <span>Security</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-[#303030] border border-[#4A4A4A] p-8">
                <h2 className="text-xl font-bebas tracking-wide text-[#FFFFFF] mb-6 pb-2 border-b border-[#4A4A4A]">
                  PERSONAL INFORMATION
                </h2>
                
                <form onSubmit={updateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-[#CFCFCF] uppercase tracking-wider mb-2">
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
                      <label className="block text-xs font-semibold text-[#8E8E8E] uppercase tracking-wider mb-2">
                        Email Address (Read-only)
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        className="bytecode-input w-full opacity-60 cursor-not-allowed bg-[#252422]"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-[#4A4A4A]">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bytecode-btn-primary"
                    >
                      {loading ? (
                        <>
                          <IconLoader2 size={16} className="animate-spin text-white" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <span>Save Profile</span>
                      )}
                    </button>

                    <Link
                      to="/dashboard"
                      className="bytecode-btn-secondary"
                    >
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "password" && (
              <div className="bg-[#303030] border border-[#4A4A4A] p-8">
                <h2 className="text-xl font-bebas tracking-wide text-[#FFFFFF] mb-6 pb-2 border-b border-[#4A4A4A]">
                  CHANGE SECURITY PASSWORD
                </h2>
                
                <form onSubmit={changePassword} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#CFCFCF] uppercase tracking-wider mb-2">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#CFCFCF] uppercase tracking-wider mb-2">
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
                      <label className="block text-xs font-semibold text-[#CFCFCF] uppercase tracking-wider mb-2">
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

                  <div className="flex items-center gap-4 pt-4 border-t border-[#4A4A4A]">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bytecode-btn-primary"
                    >
                      {loading ? (
                        <>
                          <IconLoader2 size={16} className="animate-spin text-white" />
                          <span>Changing Password...</span>
                        </>
                      ) : (
                        <>
                          <IconShieldLock size={16} />
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