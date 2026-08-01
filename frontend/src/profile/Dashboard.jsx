import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Footer from "../components/Footer";
import { SkeletonCard } from "../components/SkeletonLoader";
import { IconBrandGithub, IconTerminal, IconBook, IconTrendingUp, IconCheck, IconStar, IconArrowRight, IconLogout, IconUser, IconCode, IconRobot, IconUsers, IconSettings, IconRefresh } from "@tabler/icons-react";

// ID Card Style GitHub Profile Component
const GitHubProfileCard = React.memo(() => {
  const [githubData, setGithubData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(
    () => localStorage.getItem("githubUsername") || ""
  );
  const [showInput, setShowInput] = useState(
    !localStorage.getItem("githubUsername")
  );

  const fetchGitHubProfile = async (username) => {
    try {
      setLoading(true);
      setError(null);
      const githubApi = import.meta.env.VITE_GITHUB_API || 'https://api.github.com';
      const response = await fetch(`${githubApi}/users/${username}`);
      if (!response.ok) {
        throw new Error("GitHub profile not found");
      }
      const data = await response.json();
      setGithubData(data);
      localStorage.setItem("githubUsername", username);
      setShowInput(false);
    } catch (err) {
      setError(err.message);
      setGithubData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username && !showInput) {
      fetchGitHubProfile(username);
    }
  }, [username, showInput]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUsername = e.target.username.value.trim();
    if (newUsername) {
      setUsername(newUsername);
      fetchGitHubProfile(newUsername);
    }
  };

  const handleReset = () => {
    localStorage.removeItem("githubUsername");
    setUsername("");
    setGithubData(null);
    setShowInput(true);
    setError(null);
  };

  if (showInput) {
    return (
      <div className="bg-[#252422] border border-[#4A4A4A] p-5 w-full lg:w-80 font-jetbrains shadow-xl">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#4A4A4A]">
          <IconBrandGithub size={20} className="text-[#FF6A2A]" />
          <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wider">Connect GitHub</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="username"
            placeholder="GitHub username"
            className="bytecode-input w-full text-xs"
            defaultValue={username}
          />

          <button
            type="submit"
            className="bytecode-btn-primary w-full text-xs py-2"
          >
            Connect Profile
          </button>

          {error && <p className="text-[#FF4D4F] text-[11px] text-center font-mono">{error}</p>}
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#252422] border border-[#4A4A4A] p-5 w-full lg:w-80 font-jetbrains">
        <div className="skeleton-box h-12 w-full mb-3"></div>
        <div className="skeleton-box h-4 w-3/4 mb-2"></div>
        <div className="skeleton-box h-4 w-1/2"></div>
      </div>
    );
  }

  if (githubData) {
    return (
      <div className="bg-[#252422] border border-[#4A4A4A] p-5 w-full lg:w-80 font-jetbrains shadow-xl relative">
        <button
          onClick={handleReset}
          className="text-[#8E8E8E] hover:text-[#FF4D4F] font-bold text-xs absolute right-3 top-3 transition-colors"
          title="Disconnect GitHub"
        >
          [DISCONNECT]
        </button>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={githubData.avatar_url}
            alt={`${githubData.login}'s avatar`}
            className="w-14 h-14 border border-[#FF6A2A] object-cover"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white truncate">
              {githubData.name || githubData.login}
            </h4>
            <p className="text-xs text-[#FF6A2A] font-mono truncate">@{githubData.login}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#4A4A4A] mb-3 text-center">
          <div>
            <div className="text-base font-bold text-white font-mono">{githubData.public_repos}</div>
            <div className="text-[10px] text-[#8E8E8E] uppercase tracking-wider">Repos</div>
          </div>
          <div>
            <div className="text-base font-bold text-white font-mono">{githubData.followers}</div>
            <div className="text-[10px] text-[#8E8E8E] uppercase tracking-wider">Followers</div>
          </div>
          <div>
            <div className="text-base font-bold text-white font-mono">{githubData.following}</div>
            <div className="text-[10px] text-[#8E8E8E] uppercase tracking-wider">Following</div>
          </div>
        </div>

        <button
          onClick={() => window.open(githubData.html_url, "_blank")}
          className="bytecode-btn-secondary w-full text-xs py-2"
        >
          <IconBrandGithub size={14} />
          <span>View GitHub</span>
        </button>
      </div>
    );
  }

  return null;
});

const StatCard = React.memo(({ stat }) => (
  <div className="bytecode-card p-5 font-jetbrains relative group">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-semibold text-[#8E8E8E] uppercase tracking-wider">
        {stat.label}
      </span>
      <span className="text-xl">{stat.emoji}</span>
    </div>
    <div className="flex items-baseline mb-2">
      <span className="text-3xl font-bebas text-[#FFFFFF] tracking-wide mr-1">
        {stat.value}
      </span>
      <span className="text-xs text-[#CFCFCF] font-mono">{stat.unit}</span>
    </div>
    <div className="w-full bg-[#252422] h-1.5 border border-[#4A4A4A]">
      <div
        className="h-full bg-[#FF6A2A] transition-all duration-700"
        style={{ width: `${Math.min(stat.value, 100)}%` }}
      />
    </div>
  </div>
));

const CourseItem = React.memo(({ enrollment }) => (
  <div className="bytecode-card p-4 hover:border-[#FF6A2A] transition-colors font-jetbrains">
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white text-sm truncate mb-1">
          {enrollment.course.name}
        </h4>
        <div className="flex items-center gap-2 text-[11px] text-[#8E8E8E] font-mono">
          <span className="px-1.5 py-0.5 bg-[#252422] border border-[#4A4A4A] text-[#CFCFCF]">
            {enrollment.course.level}
          </span>
          <span>•</span>
          <span>{enrollment.course.duration}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-xs font-bold text-[#FF6A2A] font-mono">
            {Math.round(enrollment.enrollment.progress)}%
          </div>
          <div className="w-20 bg-[#252422] h-1.5 border border-[#4A4A4A] mt-1">
            <div
              className="h-full bg-[#FF6A2A]"
              style={{ width: `${enrollment.enrollment.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
));

const QuickActionItem = React.memo(({ action }) => (
  <Link
    to={action.path}
    className="bytecode-card p-5 hover:border-[#FF6A2A] hover:bg-[#383838] transition-all flex flex-col items-center justify-center text-center font-jetbrains group"
  >
    <div className="p-3 bg-[#252422] border border-[#4A4A4A] mb-3 text-[#FF6A2A] group-hover:border-[#FF6A2A] transition-colors">
      {action.icon}
    </div>
    <span className="text-xs font-semibold uppercase tracking-wider text-[#FFFFFF] group-hover:text-[#FF6A2A] transition-colors">
      {action.label}
    </span>
  </Link>
));

const DashboardCard = React.memo(
  ({ title, viewAllLink, children, className = "" }) => (
    <div className={`bytecode-card p-6 font-jetbrains ${className}`}>
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#4A4A4A]">
        <h3 className="text-xl font-bebas tracking-wide text-[#FFFFFF] flex items-center gap-2">
          <span className="text-[#FF6A2A]">//</span> {title}
        </h3>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-xs font-mono font-semibold text-[#FF8C42] hover:text-[#FF6A2A] flex items-center gap-1 transition-colors"
          >
            <span>VIEW ALL</span>
            <IconArrowRight size={14} />
          </Link>
        )}
      </div>
      {children}
    </div>
  )
);

const CoursesSection = React.memo(({ enrolledCourses }) => (
  <DashboardCard title="My Courses" viewAllLink="/courses">
    <div className="space-y-3">
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-10 bg-[#252422] border border-[#4A4A4A] p-6">
          <IconBook size={40} className="mx-auto mb-3 text-[#8E8E8E]" />
          <p className="text-xs text-[#8E8E8E] mb-4 font-mono">
            No active course enrollments found.
          </p>
          <Link
            to="/courses"
            className="bytecode-btn-primary text-xs"
          >
            Explore Courses Catalog
          </Link>
        </div>
      ) : (
        enrolledCourses.map((enrollment) => (
          <CourseItem key={enrollment.enrollment._id} enrollment={enrollment} />
        ))
      )}
    </div>
  </DashboardCard>
));

const DeveloperCornerCard = React.memo(() => {
  const [currentItem, setCurrentItem] = useState(0);
  const [developerContent, setDeveloperContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJokes = async () => {
    try {
      setLoading(true);
      const jokes = [];

      for (let i = 0; i < 6; i++) {
        const jokeApiUrl = import.meta.env.VITE_JOKE_API_URL || "https://official-joke-api.appspot.com/jokes/programming/random";
        const response = await fetch(jokeApiUrl);
        if (response.ok) {
          const jokeData = await response.json();
          const joke = jokeData[0];
          jokes.push({
            type: "joke",
            content: joke.setup,
            punchline: joke.punchline,
            emoji: "😂",
          });
        }
      }

      const staticContent = [
        {
          type: "quote",
          content: "The only way to learn a new programming language is by writing programs in it.",
          author: "Dennis Ritchie",
          emoji: "💡",
        },
        {
          type: "quote",
          content: "First, solve the problem. Then, write the code.",
          author: "John Johnson",
          emoji: "🎯",
        },
        {
          type: "wisdom",
          content: "Every great developer got there by solving problems they were unqualified to solve.",
          emoji: "⚡",
        },
      ];

      const allContent = [...staticContent, ...jokes].sort(() => Math.random() - 0.5);
      setDeveloperContent(allContent);
    } catch (error) {
      setDeveloperContent([
        {
          type: "quote",
          content: "The only way to learn a new programming language is by writing programs in it.",
          author: "Dennis Ritchie",
          emoji: "💡",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJokes();
  }, []);

  const item = developerContent[currentItem] || {
    content: "Loading developer insights...",
    emoji: "⚡"
  };

  return (
    <DashboardCard title="Developer's Corner">
      <div className="bg-[#252422] border border-[#4A4A4A] p-6 text-center">
        <div className="text-3xl mb-3">{item.emoji}</div>
        <p className="text-sm text-[#FFFFFF] italic font-mono mb-3">
          "{item.content}"
        </p>
        {item.punchline && (
          <p className="text-xs font-bold text-[#FFC300] font-mono mb-2">
            {item.punchline}
          </p>
        )}
        {item.author && (
          <p className="text-xs text-[#FF6A2A] font-bold font-mono">
            — {item.author}
          </p>
        )}

        <div className="flex justify-center items-center gap-3 mt-6 pt-4 border-t border-[#4A4A4A]">
          <button
            onClick={() => setCurrentItem((prev) => (prev + 1) % developerContent.length)}
            className="bytecode-btn-secondary text-xs py-1.5 px-3"
          >
            <span>Next Insight</span>
          </button>
          <button
            onClick={fetchJokes}
            className="bytecode-btn-secondary text-xs py-1.5 px-3"
          >
            <IconRefresh size={14} />
            <span>Refresh Jokes</span>
          </button>
        </div>
      </div>
    </DashboardCard>
  );
});

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userStats, setUserStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    averageProgress: 0,
    totalHours: 0,
  });
  const [loading, setLoading] = useState(true);

  const QUICK_ACTIONS = [
    { icon: <IconCode size={22} />, label: "Code Editor", path: "/editor" },
    { icon: <IconRobot size={22} />, label: "ByteAI Assistant", path: "/byteai" },
    { icon: <IconUsers size={22} />, label: "Dev Den", path: "/devden" },
    { icon: <IconSettings size={22} />, label: "Edit Profile", path: "/profile" },
  ];

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:5000/api');
      const response = await fetch(`${apiBase}/courses/user/enrolled`, {
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
      const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:5000/api');
      const response = await fetch(`${apiBase}/courses/user/stats`, {
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

  const USER_STATS = [
    {
      label: "Courses Enrolled",
      value: userStats.totalCourses,
      unit: "",
      emoji: "📚",
    },
    {
      label: "Average Progress",
      value: userStats.averageProgress,
      unit: "%",
      emoji: "📈",
    },
    {
      label: "Completed Tracks",
      value: userStats.completedCourses,
      unit: "",
      emoji: "✅",
    },
    {
      label: "Total XP",
      value: userStats.totalHours || (user?.xp || 0),
      unit: " XP",
      emoji: "⭐",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B1B1B] text-white font-jetbrains p-8 max-w-6xl mx-auto space-y-6">
        <SkeletonCard className="h-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-white font-jetbrains flex flex-col justify-between">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Welcome Section */}
        <div className="bytecode-card p-6 sm:p-8 mb-8 relative">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={logo}
                  alt="ByteCode Logo"
                  className="w-14 h-14 object-contain filter drop-shadow-[0_0_12px_rgba(255,106,42,0.4)]"
                />
                <div>
                  <h1 className="text-3xl font-bebas text-[#FFFFFF] tracking-wide">
                    WELCOME BACK, {user?.name?.toUpperCase()}
                  </h1>
                  <p className="text-xs text-[#8E8E8E] font-mono">
                    Session active • Role: Developer
                  </p>
                </div>
              </div>
              <div className="inline-block bg-[#252422] border border-[#FF6A2A] px-3 py-1 text-xs text-[#FF6A2A] font-mono">
                &lt;Learn_By_Doing /&gt;
              </div>
            </div>

            <GitHubProfileCard />
          </div>

          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[#4A4A4A]">
            <Link
              to="/profile"
              className="bytecode-btn-secondary text-xs"
            >
              <IconUser size={16} />
              <span>Edit Profile</span>
            </Link>
            <Link
              to="/courses"
              className="bytecode-btn-primary text-xs"
            >
              <IconBook size={16} />
              <span>Browse Catalog</span>
            </Link>
            <button
              onClick={logout}
              className="bytecode-btn-secondary text-xs border-[#FF4D4F] text-[#FF4D4F] hover:bg-[#FF4D4F]/10 hover:text-[#FF4D4F]"
            >
              <IconLogout size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {USER_STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        {/* Courses & Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CoursesSection enrolledCourses={enrolledCourses} />

          <DashboardCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-4">
              {QUICK_ACTIONS.map((action, index) => (
                <QuickActionItem key={index} action={action} />
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Developer's Corner */}
        <DeveloperCornerCard />
      </div>

      <Footer />
    </div>
  );
};

export default React.memo(Dashboard);