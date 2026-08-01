import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Footer from "../components/Footer";
import { SkeletonCard } from "../components/SkeletonLoader";
import {
  IconBook,
  IconTrendingUp,
  IconCheck,
  IconStar,
  IconArrowRight,
  IconUser,
  IconCode,
  IconRobot,
  IconUsers,
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [activities, setActivities] = useState([]);
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

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_BASE}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_BASE}/dashboard/activity`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      await Promise.all([
        fetchEnrolledCourses(),
        fetchDashboardStats(),
        fetchActivityLogs()
      ]);
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  // Compute metrics from real backend database responses
  const currentXP = dashboardStats?.totalXP ?? user?.xp ?? 0;
  const currentLevel = dashboardStats?.level ?? Math.floor(currentXP / 100) + 1;
  const streakDays = dashboardStats?.streak ?? 1;
  const enrolledCount = dashboardStats?.totalCourses ?? enrolledCourses.length;
  const completedCount = dashboardStats?.completedCourses ?? 0;
  const solvedCount = dashboardStats?.completedExercisesCount ?? 0;
  const todayXP = dashboardStats?.todayXP ?? 0;
  const dailyGoalXP = dashboardStats?.dailyGoalXP ?? 500;
  const dailyProgress = Math.min(Math.round((todayXP / dailyGoalXP) * 100), 100);

  const activeCourse = dashboardStats?.continueLearning || 
    (enrolledCourses.length > 0 ? enrolledCourses[0] : null);

  const STATS_BAR = [
    { label: "TOTAL XP", value: `${currentXP}`, icon: <IconStar size={20} className="text-[#FBC02D]" />, accent: "border-[#FBC02D]" },
    { label: "LEVEL", value: `0${currentLevel}`, icon: <IconTrophy size={20} className="text-[#66BB6A]" />, accent: "border-[#66BB6A]" },
    { label: "ENROLLED", value: `${enrolledCount}`, icon: <IconBook size={20} className="text-[#A5D6A7]" />, accent: "border-[#A5D6A7]" },
    { label: "COMPLETED", value: `${completedCount}`, icon: <IconCheck size={20} className="text-[#66BB6A]" />, accent: "border-[#66BB6A]" },
    { label: "EXERCISES", value: `${solvedCount}`, icon: <IconCode size={20} className="text-[#66BB6A]" />, accent: "border-[#66BB6A]" },
    { label: "STREAK", value: `${streakDays} DAYS`, icon: <IconFlame size={20} className="text-[#FBC02D]" />, accent: "border-[#FBC02D]" },
  ];

  const QUICK_ACTIONS = [
    { label: "Byte-Compiler", icon: <IconCode size={22} />, path: "/editor", desc: "Interactive IDE" },
    { label: "AI Companion", icon: <IconRobot size={22} />, path: "/byteai", desc: "Real-time Hints" },
    { label: "Browse Catalog", icon: <IconBook size={22} />, path: "/courses", desc: "All Pathways" },
    { label: "Dev Den", icon: <IconUsers size={22} />, path: "/devden", desc: "Peer Reviews" },
    { label: "Account Profile", icon: <IconUser size={22} />, path: "/profile", desc: "Settings" },
    { label: "Certificates", icon: <IconAward size={22} />, path: "/profile", desc: "Verifications" },
  ];

  const WEEKLY_XP = dashboardStats?.weeklyXP || [
    { day: "MON", xp: 0, height: "10%" },
    { day: "TUE", xp: 0, height: "10%" },
    { day: "WED", xp: 0, height: "10%" },
    { day: "THU", xp: 0, height: "10%" },
    { day: "FRI", xp: 0, height: "10%" },
    { day: "SAT", xp: 0, height: "10%" },
    { day: "SUN", xp: 0, height: "10%" },
  ];

  const filteredCourses = enrolledCourses.filter(item => 
    item.course?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.course?.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatActivityTime = (dateStr) => {
    if (!dateStr) return "recent";
    const d = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now - d) / (1000 * 60 * 60));
    if (diffHours < 1) return "just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1110] text-white font-inter p-10 max-w-[1800px] mx-auto space-y-8">
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
    <div className="min-h-screen bg-[#0F1110] text-[#FFFFFF] font-inter flex flex-col justify-between grid-bg">
      {/* Widescreen Main Container */}
      <div className="w-full max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-16 py-10">
        
        {/* Top Header & Greeting Section */}
        <div className="bytecode-card p-8 sm:p-10 mb-8 border border-[#2E3A33] relative shadow-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="ByteCode Logo"
                  className="w-12 h-12 object-contain filter drop-shadow-[0_0_12px_rgba(255,106,42,0.5)]"
                />
                <span className="font-geist-pixel text-xl sm:text-2xl text-[#66BB6A]">
                  BYTECODE // DEV_ENVIRONMENT
                </span>
                <span className="px-2.5 py-0.5 bg-[#0F1110] border border-[#66BB6A] text-[#66BB6A] text-xs font-mono font-bold">
                   ACTIVE_SESSION
                </span>
              </div>

              <h1 className="font-geist-pixel text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide">
                GOOD MORNING, {user?.name?.toUpperCase() || "DEVELOPER"}
              </h1>

              <p className="text-base text-[#D7D7D7] font-inter max-w-3xl">
                Ready to continue your software engineering pathway? You have active progress in{" "}
                <span className="text-[#66BB6A] font-bold font-mono">
                  {activeCourse ? activeCourse.course.name : "learning tracks"}
                </span>.
              </p>
            </div>

            {/* Top Action Buttons & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-70">
                <input
                  type="text"
                  placeholder="Filter courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bytecode-input w-full h-11 pl-2 pr-4 text-sm"
                />
                {/* <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" /> */}
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

        {/* 6-Column Stats Row (Powered by MongoDB) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {STATS_BAR.map((stat, idx) => (
            <div
              key={idx}
              className={`bytecode-card p-5 border-l-4 ${stat.accent} flex flex-col justify-between hover:border-[#66BB6A] transition-colors`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-geist-pixel text-xs text-[#9CA3AF] tracking-wider">
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
              <div className="bytecode-card p-8 border border-[#66BB6A] relative bg-[#0F1110]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2E3A33]">
                  <span className="font-geist-pixel text-xs text-[#66BB6A] uppercase tracking-wider flex items-center gap-2">
                    <IconPlayerPlay size={16} />
                    RESUME_LAST_TRACK
                  </span>
                  <span className="text-xs font-mono text-[#9CA3AF]">
                    {activeCourse.course.level} • {activeCourse.course.duration}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
                  <div>
                    <h2 className="font-geist-pixel text-2xl sm:text-3xl text-white mb-2">
                      {activeCourse.course.name}
                    </h2>
                    <p className="text-sm text-[#D7D7D7] font-inter max-w-xl line-clamp-2">
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
                    <span className="text-[#D7D7D7]">Progress Completed</span>
                    <span className="text-[#66BB6A] font-bold">{Math.round(activeCourse.enrollment.progress)}%</span>
                  </div>
                  <div className="w-full bg-[#0F1110] h-3 border border-[#2E3A33]">
                    <div
                      className="h-full bg-[#66BB6A] transition-all duration-700"
                      style={{ width: `${activeCourse.enrollment.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bytecode-card p-10 text-center border border-[#2E3A33]">
                <IconBook size={48} className="mx-auto mb-4 text-[#66BB6A]" />
                <h2 className="font-geist-pixel text-2xl text-white mb-2">// NO_ACTIVE_COURSES</h2>
                <p className="text-sm text-[#D7D7D7] max-w-md mx-auto mb-6">
                  Explore our curated developer learning tracks to start building production apps.
                </p>
                <Link to="/courses" className="bytecode-btn-primary h-11 text-sm">
                  Browse Catalog Pathways
                </Link>
              </div>
            )}

            {/* Enrolled Pathways Section */}
            <div className="bytecode-card p-8">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#2E3A33]">
                <h3 className="font-geist-pixel text-xl sm:text-2xl text-white flex items-center gap-3">
                  <span className="text-[#66BB6A] font-mono">//</span> MY_LEARNING_PATHWAYS
                </h3>
                <Link
                  to="/courses"
                  className="text-xs font-mono font-semibold text-[#A5D6A7] hover:text-[#66BB6A] flex items-center gap-1 uppercase tracking-wider transition-colors"
                >
                  <span>ALL PATHWAYS</span>
                  <IconArrowRight size={16} />
                </Link>
              </div>

              <div className="space-y-4">
                {filteredCourses.length === 0 ? (
                  <p className="text-sm text-[#9CA3AF] font-mono text-center py-6">
                    No enrolled courses matched your search query.
                  </p>
                ) : (
                  filteredCourses.map((item) => (
                    <div
                      key={item.enrollment._id}
                      className="p-5 bg-[#0F1110] border border-[#2E3A33] hover:border-[#66BB6A] transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-lg truncate mb-1">
                          {item.course.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-[#9CA3AF] font-mono">
                          <span className="px-2 py-0.5 bg-[#0F1110] border border-[#2E3A33] text-[#D7D7D7]">
                            {item.course.level}
                          </span>
                          <span>•</span>
                          <span>{item.course.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#66BB6A] font-mono">
                            {Math.round(item.enrollment.progress)}%
                          </div>
                          <div className="w-28 bg-[#0F1110] h-2 border border-[#2E3A33] mt-1">
                            <div
                              className="h-full bg-[#66BB6A]"
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

            {/* Recent Activity Timeline (Live MongoDB Data) */}
            <div className="bytecode-card p-8">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-[#2E3A33]">
                <h3 className="font-geist-pixel text-xl sm:text-2xl text-white flex items-center gap-3">
                  <span className="text-[#66BB6A] font-mono">//</span> RECENT_ACTIVITY_LOGS
                </h3>
                <span className="text-xs font-mono text-[#66BB6A] font-bold">[LIVE_DB_LOGS]</span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {activities.length === 0 ? (
                  <div className="flex items-center gap-4 p-4 bg-[#0F1110] border border-[#2E3A33]">
                    <IconActivity size={18} className="text-[#66BB6A] flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-white font-bold">Platform Session Active: </span>
                      <span className="text-[#D7D7D7]">Start exercises or lessons to build your timeline</span>
                    </div>
                    <span className="text-[#66BB6A] font-bold">+5 XP</span>
                    <span className="text-[#9CA3AF]">today</span>
                  </div>
                ) : (
                  activities.map((act, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-[#0F1110] border border-[#2E3A33]">
                      {act.type === 'streak' ? (
                        <IconCalendarCheck size={18} className="text-[#FBC02D] flex-shrink-0" />
                      ) : act.type === 'course' ? (
                        <IconBook size={18} className="text-[#A5D6A7] flex-shrink-0" />
                      ) : (
                        <IconActivity size={18} className="text-[#66BB6A] flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <span className="text-white font-bold">{act.title}: </span>
                        <span className="text-[#D7D7D7]">{act.description}</span>
                      </div>
                      {act.xpEarned > 0 && (
                        <span className="text-[#66BB6A] font-bold">+{act.xpEarned} XP</span>
                      )}
                      <span className="text-[#9CA3AF]">{formatActivityTime(act.createdAt)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Side Panel (35% Width - No Achievements) */}
          <div className="space-y-8">
            
            {/* Daily Goal & Progress Widget */}
            <div className="bytecode-card p-6 border border-[#2E3A33]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2E3A33]">
                <h3 className="font-geist-pixel text-lg text-white flex items-center gap-2">
                  <IconTarget size={18} className="text-[#66BB6A]" />
                  DAILY_XP_GOAL
                </h3>
                <span className="text-xs font-mono text-[#66BB6A] font-bold">{dailyProgress}%</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-baseline font-mono">
                  <span className="text-2xl font-geist-pixel text-white">{todayXP} <span className="text-xs text-[#9CA3AF]">/ {dailyGoalXP} XP</span></span>
                  <span className="text-xs text-[#FBC02D] font-bold">Target: {dailyGoalXP} XP</span>
                </div>

                <div className="w-full bg-[#0F1110] h-3 border border-[#2E3A33]">
                  <div
                    className="h-full bg-[#66BB6A] transition-all duration-500"
                    style={{ width: `${dailyProgress}%` }}
                  />
                </div>

                <p className="text-xs text-[#D7D7D7] font-inter">
                  {dailyProgress >= 100 ? (
                    <span className="text-[#66BB6A] font-bold"> Daily XP Goal achieved! Keep building tracks.</span>
                  ) : (
                    <>Earn <span className="text-[#66BB6A] font-bold">{Math.max(0, dailyGoalXP - todayXP)} more XP</span> today to reach your goal!</>
                  )}
                </p>
              </div>
            </div>

            {/* Weekly XP Bar Chart Matrix */}
            <div className="bytecode-card p-6 border border-[#2E3A33]">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#2E3A33]">
                <h3 className="font-geist-pixel text-lg text-white flex items-center gap-2">
                  <IconTrendingUp size={18} className="text-[#66BB6A]" />
                  WEEKLY_XP_MATRIX
                </h3>
                <span className="text-xs font-mono text-[#9CA3AF]">LIVE_DATA</span>
              </div>

              <div className="flex items-end justify-between h-40 pt-4 gap-2">
                {WEEKLY_XP.map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                    <div
                      className="w-full bg-[#66BB6A] hover:bg-[#A5D6A7] transition-all relative group"
                      style={{ height: bar.height }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0F1110] border border-[#66BB6A] text-[10px] font-mono px-1.5 py-0.5 text-white whitespace-nowrap z-10 transition-opacity">
                        {bar.xp} XP
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[#9CA3AF]">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions 6-Tile Cluster */}
            <div className="bytecode-card p-6 border border-[#2E3A33]">
              <h3 className="font-geist-pixel text-lg text-white mb-4 pb-3 border-b border-[#2E3A33]">
                QUICK_ACTIONS
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map((act, i) => (
                  <Link
                    key={i}
                    to={act.path}
                    className="p-3 bg-[#0F1110] border border-[#2E3A33] hover:border-[#66BB6A] hover:bg-[#1D2420] transition-all flex flex-col items-start gap-1 group"
                  >
                    <div className="text-[#66BB6A] group-hover:scale-110 transition-transform">
                      {act.icon}
                    </div>
                    <span className="font-geist-pixel text-xs text-white group-hover:text-[#66BB6A]">
                      {act.label}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF] font-mono">
                      {act.desc}
                    </span>
                  </Link>
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