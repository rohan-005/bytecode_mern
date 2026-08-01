import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Footer from "../components/Footer";
import { SkeletonCard } from "../components/SkeletonLoader";
import {
  IconTerminal,
  IconBook,
  IconTrendingUp,
  IconCheck,
  IconStar,
  IconArrowRight,
  IconLogout,
  IconUser,
  IconCode,
  IconRobot,
  IconUsers,
  IconSettings,
  IconRefresh,
  IconTrophy,
  IconFlame,
  IconTarget,
  IconSearch,
  IconPlayerPlay,
  IconAward,
  IconActivity,
  IconCalendarCheck
} from "@tabler/icons-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userStats, setUserStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    averageProgress: 0,
    totalHours: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const API_BASE = useMemo(() => {
    return import.meta.env.VITE_API_URL || 
      (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:5000/api');
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_BASE}/courses/user/enrolled`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEnrolledCourses(data);
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_BASE}/courses/user/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      await Promise.all([fetchEnrolledCourses(), fetchUserStats()]);
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  // Compute calculated metrics
  const activeCourse = enrolledCourses.length > 0 ? enrolledCourses[0] : null;
  const currentXP = userStats.totalHours || (user?.xp || 450);
  const currentLevel = Math.floor(currentXP / 250) + 1;
  const levelXP = currentXP % 250;
  const levelProgress = Math.round((levelXP / 250) * 100);
  const dailyGoalXP = 750;
  const todayXP = 520;
  const dailyProgress = Math.round((todayXP / dailyGoalXP) * 100);

  const STATS_BAR = [
    { label: "TOTAL XP", value: `${currentXP}`, icon: <IconStar size={20} className="text-[#FFC300]" />, accent: "border-[#FFC300]" },
    { label: "LEVEL", value: `0${currentLevel}`, icon: <IconTrophy size={20} className="text-[#FF6A2A]" />, accent: "border-[#FF6A2A]" },
    { label: "ENROLLED", value: `${userStats.totalCourses}`, icon: <IconBook size={20} className="text-[#FF8C42]" />, accent: "border-[#FF8C42]" },
    { label: "COMPLETED", value: `${userStats.completedCourses}`, icon: <IconCheck size={20} className="text-[#35C759]" />, accent: "border-[#35C759]" },
    { label: "SOLVED", value: `${userStats.completedCourses * 4 + 7}`, icon: <IconCode size={20} className="text-[#FF6A2A]" />, accent: "border-[#FF6A2A]" },
    { label: "STREAK", value: "5 DAYS", icon: <IconFlame size={20} className="text-[#FFC300]" />, accent: "border-[#FFC300]" },
  ];

  const QUICK_ACTIONS = [
    { label: "Byte-Compiler", icon: <IconCode size={22} />, path: "/editor", desc: "Interactive IDE" },
    { label: "AI Companion", icon: <IconRobot size={22} />, path: "/byteai", desc: "Real-time Hints" },
    { label: "Browse Catalog", icon: <IconBook size={22} />, path: "/courses", desc: "All Pathways" },
    { label: "Dev Den", icon: <IconUsers size={22} />, path: "/devden", desc: "Peer Reviews" },
    { label: "Account Profile", icon: <IconUser size={22} />, path: "/profile", desc: "Settings" },
    { label: "Certificates", icon: <IconAward size={22} />, path: "/profile", desc: "Verifications" },
  ];

  const WEEKLY_XP = [
    { day: "MON", xp: 120, height: "60%" },
    { day: "TUE", xp: 200, height: "100%" },
    { day: "WED", xp: 90, height: "45%" },
    { day: "THU", xp: 150, height: "75%" },
    { day: "FRI", xp: 180, height: "90%" },
    { day: "SAT", xp: 60, height: "30%" },
    { day: "SUN", xp: 110, height: "55%" },
  ];

  const ACHIEVEMENTS = [
    { title: "FIRST_CODE", desc: "Completed initial exercise", unlocked: true, icon: "⚡" },
    { title: "STREAK_BUILDER", desc: "5-day coding streak active", unlocked: true, icon: "🔥" },
    { title: "SYNTAX_MASTER", desc: "Completed 10 algorithm problems", unlocked: true, icon: "🎯" },
    { title: "ALGO_EXPERT", desc: "Solve 50 hard exercises", unlocked: false, icon: "🔒" },
  ];

  const filteredCourses = enrolledCourses.filter(item => 
    item.course?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.course?.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B1B1B] text-white font-inter p-10 max-w-[1800px] mx-auto space-y-8">
        <SkeletonCard className="h-48 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SkeletonCard className="lg:col-span-2 h-96" />
          <SkeletonCard className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-[#FFFFFF] font-inter flex flex-col justify-between grid-bg">
      {/* Widescreen Main Container */}
      <div className="w-full max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-16 py-10">
        
        {/* Top Header & Greeting Section */}
        <div className="bytecode-card p-8 sm:p-10 mb-8 border border-[#4A4A4A] relative shadow-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="ByteCode Logo"
                  className="w-12 h-12 object-contain filter drop-shadow-[0_0_12px_rgba(255,106,42,0.5)]"
                />
                <span className="font-geist-pixel text-xl sm:text-2xl text-[#FF6A2A]">
                  BYTECODE // DEV_ENVIRONMENT
                </span>
                <span className="px-2.5 py-0.5 bg-[#252422] border border-[#FF35C759] text-[#35C759] text-xs font-mono font-bold">
                  ● ACTIVE_SESSION
                </span>
              </div>

              <h1 className="font-geist-pixel text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide">
                GOOD MORNING, {user?.name?.toUpperCase() || "DEVELOPER"}
              </h1>

              <p className="text-base text-[#CFCFCF] font-inter max-w-3xl">
                Ready to continue your software engineering pathway? You have active progress in{" "}
                <span className="text-[#FF6A2A] font-bold font-mono">
                  {activeCourse ? activeCourse.course.name : "learning tracks"}
                </span>.
              </p>
            </div>

            {/* Top Action Buttons & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Filter courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bytecode-input w-full h-11 pl-10 pr-4 text-sm"
                />
                <IconSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E8E]" />
              </div>

              {activeCourse && (
                <button
                  onClick={() => navigate(`/course/${activeCourse.course.id || activeCourse.course._id}`)}
                  className="bytecode-btn-primary h-11 text-sm whitespace-nowrap"
                >
                  <IconPlayerPlay size={18} />
                  <span>CONTINUE LEARNING</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 6-Column Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {STATS_BAR.map((stat, idx) => (
            <div
              key={idx}
              className={`bytecode-card p-5 border-l-4 ${stat.accent} flex flex-col justify-between hover:border-[#FF6A2A] transition-colors`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-geist-pixel text-xs text-[#8E8E8E] tracking-wider">
                  {stat.label}
                </span>
                {stat.icon}
              </div>
              <div className="font-geist-pixel text-2xl sm:text-3xl text-white">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content & Right Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Main Left/Center Column (65% Width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Resume Last Course Feature Card */}
            {activeCourse ? (
              <div className="bytecode-card p-8 border border-[#FF6A2A] relative bg-[#252422]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#4A4A4A]">
                  <span className="font-geist-pixel text-xs text-[#FF6A2A] uppercase tracking-wider flex items-center gap-2">
                    <IconPlayerPlay size={16} />
                    RESUME_LAST_TRACK
                  </span>
                  <span className="text-xs font-mono text-[#8E8E8E]">
                    {activeCourse.course.level} • {activeCourse.course.duration}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
                  <div>
                    <h2 className="font-geist-pixel text-2xl sm:text-3xl text-white mb-2">
                      {activeCourse.course.name}
                    </h2>
                    <p className="text-sm text-[#CFCFCF] font-inter max-w-xl line-clamp-2">
                      {activeCourse.course.description}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/course/${activeCourse.course.id || activeCourse.course._id}`)}
                    className="bytecode-btn-primary h-11 text-sm whitespace-nowrap self-stretch sm:self-auto"
                  >
                    <span>Resume Course</span>
                    <IconArrowRight size={18} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#CFCFCF]">Progress Completed</span>
                    <span className="text-[#FF6A2A] font-bold">{Math.round(activeCourse.enrollment.progress)}%</span>
                  </div>
                  <div className="w-full bg-[#1B1B1B] h-3 border border-[#4A4A4A]">
                    <div
                      className="h-full bg-[#FF6A2A] transition-all duration-700"
                      style={{ width: `${activeCourse.enrollment.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bytecode-card p-10 text-center border border-[#4A4A4A]">
                <IconBook size={48} className="mx-auto mb-4 text-[#FF6A2A]" />
                <h2 className="font-geist-pixel text-2xl text-white mb-2">// NO_ACTIVE_COURSES</h2>
                <p className="text-sm text-[#CFCFCF] max-w-md mx-auto mb-6">
                  Explore our curated developer learning tracks to start building production apps.
                </p>
                <Link to="/courses" className="bytecode-btn-primary h-11 text-sm">
                  Browse Catalog Pathways
                </Link>
              </div>
            )}

            {/* Enrolled Pathways Section */}
            <div className="bytecode-card p-8">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#4A4A4A]">
                <h3 className="font-geist-pixel text-xl sm:text-2xl text-white flex items-center gap-3">
                  <span className="text-[#FF6A2A] font-mono">//</span> MY_LEARNING_PATHWAYS
                </h3>
                <Link
                  to="/courses"
                  className="text-xs font-mono font-semibold text-[#FF8C42] hover:text-[#FF6A2A] flex items-center gap-1 uppercase tracking-wider transition-colors"
                >
                  <span>ALL PATHWAYS</span>
                  <IconArrowRight size={16} />
                </Link>
              </div>

              <div className="space-y-4">
                {filteredCourses.length === 0 ? (
                  <p className="text-sm text-[#8E8E8E] font-mono text-center py-6">
                    No enrolled courses matched your search query.
                  </p>
                ) : (
                  filteredCourses.map((item) => (
                    <div
                      key={item.enrollment._id}
                      className="p-5 bg-[#252422] border border-[#4A4A4A] hover:border-[#FF6A2A] transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-lg truncate mb-1">
                          {item.course.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-[#8E8E8E] font-mono">
                          <span className="px-2 py-0.5 bg-[#1B1B1B] border border-[#4A4A4A] text-[#CFCFCF]">
                            {item.course.level}
                          </span>
                          <span>•</span>
                          <span>{item.course.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#35C759] font-mono">
                            {Math.round(item.enrollment.progress)}%
                          </div>
                          <div className="w-28 bg-[#1B1B1B] h-2 border border-[#4A4A4A] mt-1">
                            <div
                              className="h-full bg-[#35C759]"
                              style={{ width: `${item.enrollment.progress}%` }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/course/${item.course.id || item.course._id}`)}
                          className="bytecode-btn-secondary h-9 px-4 text-xs"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bytecode-card p-8">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#4A4A4A]">
                <h3 className="font-geist-pixel text-xl sm:text-2xl text-white flex items-center gap-3">
                  <span className="text-[#FF6A2A] font-mono">//</span> RECENT_ACTIVITY_LOGS
                </h3>
                <span className="text-xs font-mono text-[#8E8E8E]">[REALTIME_AUDIT]</span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="flex items-center gap-4 p-4 bg-[#252422] border border-[#4A4A4A]">
                  <IconActivity size={18} className="text-[#FF6A2A] flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-white font-bold">Exercise Completed: </span>
                    <span className="text-[#CFCFCF]">"Array Manipulation & Algorithms"</span>
                  </div>
                  <span className="text-[#35C759] font-bold">+25 XP</span>
                  <span className="text-[#8E8E8E]">2h ago</span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#252422] border border-[#4A4A4A]">
                  <IconCalendarCheck size={18} className="text-[#35C759] flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-white font-bold">Daily Streak Extended: </span>
                    <span className="text-[#CFCFCF]">5 consecutive days logged</span>
                  </div>
                  <span className="text-[#FFC300] font-bold">🔥 STREAK</span>
                  <span className="text-[#8E8E8E]">1d ago</span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#252422] border border-[#4A4A4A]">
                  <IconBook size={18} className="text-[#FF8C42] flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-white font-bold">Enrolled Track: </span>
                    <span className="text-[#CFCFCF]">"Full-Stack Web Engineering"</span>
                  </div>
                  <span className="text-[#FF8C42] font-bold">ENROLLED</span>
                  <span className="text-[#8E8E8E]">3d ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Panel (35% Width) */}
          <div className="space-y-8">
            
            {/* Daily Goal & Progress Widget */}
            <div className="bytecode-card p-6 border border-[#4A4A4A]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#4A4A4A]">
                <h3 className="font-geist-pixel text-lg text-white flex items-center gap-2">
                  <IconTarget size={18} className="text-[#FF6A2A]" />
                  DAILY_XP_GOAL
                </h3>
                <span className="text-xs font-mono text-[#35C759] font-bold">{dailyProgress}%</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-baseline font-mono">
                  <span className="text-2xl font-geist-pixel text-white">{todayXP} <span className="text-xs text-[#8E8E8E]">/ {dailyGoalXP} XP</span></span>
                  <span className="text-xs text-[#FFC300] font-bold">Target: 750 XP</span>
                </div>

                <div className="w-full bg-[#252422] h-3 border border-[#4A4A4A]">
                  <div
                    className="h-full bg-[#FF6A2A]"
                    style={{ width: `${dailyProgress}%` }}
                  />
                </div>

                <p className="text-xs text-[#CFCFCF] font-inter">
                  Earn <span className="text-[#FF6A2A] font-bold">230 more XP</span> today to complete your daily activity target!
                </p>
              </div>
            </div>

            {/* Weekly XP Bar Chart Matrix */}
            <div className="bytecode-card p-6 border border-[#4A4A4A]">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#4A4A4A]">
                <h3 className="font-geist-pixel text-lg text-white flex items-center gap-2">
                  <IconTrendingUp size={18} className="text-[#35C759]" />
                  WEEKLY_XP_MATRIX
                </h3>
                <span className="text-xs font-mono text-[#8E8E8E]">THIS WEEK</span>
              </div>

              <div className="flex items-end justify-between h-36 pt-4 gap-2">
                {WEEKLY_XP.map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                    <div
                      className="w-full bg-[#FF6A2A] hover:bg-[#FF8C42] transition-all relative group"
                      style={{ height: bar.height }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#252422] border border-[#FF6A2A] text-[10px] font-mono px-1.5 py-0.5 text-white whitespace-nowrap z-10 transition-opacity">
                        {bar.xp} XP
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[#8E8E8E]">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions 6-Tile Cluster */}
            <div className="bytecode-card p-6 border border-[#4A4A4A]">
              <h3 className="font-geist-pixel text-lg text-white mb-4 pb-3 border-b border-[#4A4A4A]">
                QUICK_ACTIONS
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map((act, i) => (
                  <Link
                    key={i}
                    to={act.path}
                    className="p-3 bg-[#252422] border border-[#4A4A4A] hover:border-[#FF6A2A] hover:bg-[#303030] transition-all flex flex-col items-start gap-1 group"
                  >
                    <div className="text-[#FF6A2A] group-hover:scale-110 transition-transform">
                      {act.icon}
                    </div>
                    <span className="font-geist-pixel text-xs text-white group-hover:text-[#FF6A2A]">
                      {act.label}
                    </span>
                    <span className="text-[10px] text-[#8E8E8E] font-mono">
                      {act.desc}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Achievement Showcase */}
            <div className="bytecode-card p-6 border border-[#4A4A4A]">
              <h3 className="font-geist-pixel text-lg text-white mb-4 pb-3 border-b border-[#4A4A4A] flex items-center justify-between">
                <span>ACHIEVEMENTS</span>
                <span className="text-xs font-mono text-[#35C759]">3/4 UNLOCKED</span>
              </h3>

              <div className="space-y-3">
                {ACHIEVEMENTS.map((ach, i) => (
                  <div
                    key={i}
                    className={`p-3 border flex items-center gap-3 ${
                      ach.unlocked 
                        ? "bg-[#252422] border-[#35C759]/40 text-white" 
                        : "bg-[#1B1B1B] border-[#4A4A4A] text-[#8E8E8E] opacity-60"
                    }`}
                  >
                    <span className="text-2xl">{ach.icon}</span>
                    <div>
                      <div className="font-geist-pixel text-xs text-white">{ach.title}</div>
                      <div className="text-[11px] font-inter text-[#CFCFCF]">{ach.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
};

export default React.memo(Dashboard);