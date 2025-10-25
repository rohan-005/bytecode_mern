import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Footer from "../components/Footer";

// Enhanced StatCard with modern design
const StatCard = React.memo(({ stat }) => (
  <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-purple-500/10">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-300 font-medium text-sm uppercase tracking-wider">{stat.label}</h3>
        <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
          {stat.emoji}
        </span>
      </div>
      <div className="flex items-baseline mb-3">
        <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mr-2">
          {stat.value}
        </span>
        <span className="text-gray-400 text-sm">{stat.unit}</span>
      </div>
      <div className="mt-2">
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${stat.color} shadow-lg`}
            style={{ width: `${Math.min(stat.value, 100)}%` }}
          />
        </div>
      </div>
    </div>
  </div>
));

// Enhanced CourseItem with modern design
const CourseItem = React.memo(({ enrollment }) => (
  <div className="group relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 hover:from-purple-900/20 hover:to-blue-900/20 transition-all duration-500 border border-gray-700 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h4 className="font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text">
          {enrollment.course.name}
        </h4>
        <p className="text-sm text-gray-400 flex items-center gap-2">
          <span className="px-2 py-1 bg-gray-700 rounded-full text-xs">Level: {enrollment.course.level}</span>
          <span>•</span>
          <span>{enrollment.course.duration}</span>
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-20 h-20 transform group-hover:scale-110 transition-transform duration-300">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#374151"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeDasharray={`${enrollment.enrollment.progress}, 100`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
          </div>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
            {Math.round(enrollment.enrollment.progress)}%
          </span>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse group-hover:scale-150 transition-transform duration-300" />
      </div>
    </div>
  </div>
));

const ActivityItem = React.memo(({ activity }) => (
  <div className="group flex items-start space-x-4 p-4 hover:bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
    <div className="relative">
      <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0 group-hover:animate-ping absolute" />
      <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0 relative" />
    </div>
    <div className="flex-1">
      <p className="text-white">
        <span className="font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          {activity.action}
        </span>{" "}
        {activity.course && <span className="text-gray-300">{activity.course}</span>}
        {activity.badge && <span className="text-yellow-400">"{activity.badge}" badge</span>}
      </p>
      <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
        <span>🕒</span>
        {activity.time}
      </p>
    </div>
  </div>
));

const QuickActionItem = React.memo(({ action }) => (
  <Link
    to={action.path}
    className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 hover:border-transparent transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10 text-center">
      <span className="text-3xl mb-3 block transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
        {action.icon}
      </span>
      <span className="font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
        {action.label}
      </span>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
  </Link>
));

const LogoutButton = React.memo(({ onClick }) => (
  <button
    onClick={onClick}
    className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-500 shadow-2xl hover:shadow-red-500/20 hover:scale-105 overflow-hidden"
  >
    <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    <div className="relative z-10 flex items-center gap-3">
      <svg
        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span>Logout</span>
    </div>
  </button>
));

const DashboardCard = React.memo(
  ({ title, viewAllLink, children, className = "" }) => (
    <div
      className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700 hover:border-purple-500/30 transition-all duration-500 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {title}
          </h3>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="group/view-all flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold text-sm transition-all duration-300 hover:gap-3"
            >
              View All
              <span className="transform group-hover/view-all:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          )}
        </div>
        {children}
      </div>
    </div>
  )
);

const CoursesSection = React.memo(({ enrolledCourses }) => (
  <DashboardCard title="My Courses" viewAllLink="/courses">
    <div className="space-y-4">
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-8xl mb-6 transform hover:scale-110 transition-transform duration-500">📚</div>
          <p className="text-gray-400 mb-6 text-lg">You haven't enrolled in any courses yet</p>
          <Link
            to="/courses"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-500 shadow-2xl hover:shadow-purple-500/20 hover:scale-105"
          >
            Explore Courses
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
  const [isHovered, setIsHovered] = useState(false);
  
  const developerContent = [
    // Programming Quotes
    {
      type: "quote",
      content: "The only way to learn a new programming language is by writing programs in it.",
      author: "Dennis Ritchie",
      emoji: "💡",
      gradient: "from-yellow-500/20 to-orange-500/20"
    },
    {
      type: "quote", 
      content: "First, solve the problem. Then, write the code.",
      author: "John Johnson",
      emoji: "🎯",
      gradient: "from-green-500/20 to-blue-500/20"
    },
    {
      type: "quote",
      content: "Code is like humor. When you have to explain it, it's bad.",
      author: "Cory House",
      emoji: "😄",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    
    // Meaningful Lines
    {
      type: "wisdom",
      content: "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.",
      emoji: "🚀",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      type: "wisdom",
      content: "The best error message is the one that never shows up.",
      emoji: "✅",
      gradient: "from-emerald-500/20 to-green-500/20"
    },
    {
      type: "wisdom", 
      content: "Make it work, make it right, make it fast.",
      emoji: "⚡",
      gradient: "from-orange-500/20 to-red-500/20"
    },
    
    // Developer Jokes
    {
      type: "joke",
      content: "Why do programmers prefer dark mode? Because light attracts bugs!",
      emoji: "🐛",
      gradient: "from-lime-500/20 to-green-500/20"
    },
    {
      type: "joke",
      content: "There are only 10 types of people in the world: those who understand binary and those who don't.",
      emoji: "💻",
      gradient: "from-indigo-500/20 to-purple-500/20"
    },
    {
      type: "joke",
      content: "Why do Java developers wear glasses? Because they can't C#!",
      emoji: "👓",
      gradient: "from-red-500/20 to-pink-500/20"
    },
    {
      type: "joke", 
      content: "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?'",
      emoji: "🍻",
      gradient: "from-amber-500/20 to-yellow-500/20"
    },
    {
      type: "joke",
      content: "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings.",
      emoji: "😢",
      gradient: "from-gray-500/20 to-blue-500/20"
    },
    {
      type: "joke",
      content: "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
      emoji: "💡",
      gradient: "from-cyan-500/20 to-blue-500/20"
    },
    {
      type: "joke",
      content: "Why do programmers always mix up Halloween and Christmas? Because Oct 31 equals Dec 25.",
      emoji: "🎃",
      gradient: "from-orange-500/20 to-red-500/20"
    },
    {
      type: "joke",
      content: "I'd tell you a joke about UDP, but you might not get it.",
      emoji: "📡",
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    {
      type: "joke",
      content: "Why do programmers hate nature? It has too many bugs.",
      emoji: "🌳",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      type: "joke",
      content: "What's a programmer's favorite hangout place? The Foo Bar.",
      emoji: "🍸",
      gradient: "from-rose-500/20 to-pink-500/20"
    }
  ];

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentItem((prev) => (prev + 1) % developerContent.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [developerContent.length, isHovered]);

  const item = developerContent[currentItem];

  return (
    <DashboardCard 
      title="Developer's Corner" 
      className="lg:col-span-2"
    >
      <div 
        className="text-center py-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative inline-block mb-6 transform hover:scale-110 transition-transform duration-500`}>
          <div className={`text-6xl mb-2 animate-bounce hover:animate-spin transition-all duration-1000`}>
            {item.emoji}
          </div>
          <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-full blur-xl opacity-50 -z-10`} />
        </div>
        
        <div className="relative">
          <div className={`bg-gradient-to-r ${item.gradient} p-8 rounded-2xl backdrop-blur-sm border border-gray-700/50 transform hover:scale-105 transition-all duration-500`}>
            <p className="text-xl text-white font-light italic mb-4 leading-relaxed">
              "{item.content}"
            </p>
            
            {item.author && (
              <p className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                — {item.author}
              </p>
            )}
          </div>
          
          <div className="mt-6 flex justify-center items-center gap-4">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${
              item.type === 'quote' 
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
                : item.type === 'wisdom'
                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
            }`}>
              <span>
                {item.type === 'quote' ? '💭' : 
                 item.type === 'wisdom' ? '🌟' : '😂'}
              </span>
              {item.type === 'quote' ? 'Inspirational Quote' : 
               item.type === 'wisdom' ? 'Developer Wisdom' : 'Programmer Humor'}
            </span>
          </div>
        </div>

        <div className="flex justify-center space-x-3 mt-8">
          {developerContent.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentItem(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 transform hover:scale-150 ${
                index === currentItem 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <div className="mt-6 text-sm text-gray-400 flex items-center justify-center gap-2">
          <span className="bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
            {currentItem + 1} / {developerContent.length}
          </span>
          <span>✨ Hover to pause • Click dots to navigate</span>
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
    totalHours: 0
  });
  const [loading, setLoading] = useState(true);

  const QUICK_ACTIONS = [
    { icon: "🚀", label: "Practice Coding", path: "/practice" },
    { icon: "🛠️", label: "Work on Projects", path: "/projects" },
    { icon: "👥", label: "Join Community", path: "/community" },
    { icon: "⚙️", label: "Settings", path: "/settings" },
  ];

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔄 Fetching enrolled courses for dashboard...');
      
      if (!token) {
        console.error('❌ No token found in localStorage');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/courses/user/enrolled`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Enrolled courses data received:', data);
      
      setEnrolledCourses(data);
      
    } catch (error) {
      console.error('❌ Error fetching enrolled courses:', error);
    }
  };

  // Fetch user stats
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/courses/user/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      await Promise.all([
        fetchEnrolledCourses(),
        fetchUserStats()
      ]);
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
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      label: "Average Progress",
      value: userStats.averageProgress,
      unit: "%",
      emoji: "📈",
      color: "bg-gradient-to-r from-orange-500 to-red-500",
    },
    {
      label: "Courses Completed",
      value: userStats.completedCourses,
      unit: "",
      emoji: "✅",
      color: "bg-gradient-to-r from-yellow-500 to-amber-500",
    },
    {
      label: "Hours Learned",
      value: userStats.totalHours,
      unit: "h",
      emoji: "⏰",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900/20 text-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Enhanced Welcome Section */}
<div className="w-full bg-gradient-to-r from-purple-900 via-gray-800 to-gray-900 rounded-2xl p-8 text-white mb-8 shadow-2xl border border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={logo}
                  alt="ByteCode Logo"
                  className="w-20 h-20 md:w-25 md:h-25 lg:w-30 lg:h-30 drop-shadow-2xl"
                />
                <div>
                  <p className="text-blue-400 text-5xl mb-1 font-transformer">
                    Welcome to ByteCode
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Hello, {user?.name}!
                  </h1>
                </div>
              </div>
              <p className="text-purple-200 text-6xl font-transformer">
                &lt;<span className="font-ice">Learn By Doing</span>/&gt;
              </p>
            </div>
            <LogoutButton onClick={logout} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="font-semibold text-gray-300">Email</p>
              <p className="text-purple-200 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/profile"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-lg"
            >
              Edit Profile
            </Link>
            <Link
              to="/courses"
              className="border-2 border-purple-500 text-purple-300 px-6 py-3 rounded-lg font-semibold hover:bg-purple-500 hover:text-white transition duration-200"
            >
              Browse Courses
            </Link>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {USER_STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        {/* Enhanced Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <CoursesSection enrolledCourses={enrolledCourses} />

          {/* Enhanced Quick Actions */}
          <DashboardCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-5">
              {QUICK_ACTIONS.map((action, index) => (
                <QuickActionItem key={index} action={action} />
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Enhanced Developer's Corner */}
        <DeveloperCornerCard />
      </div>
      <Footer />
    </div>
  );
};

export default React.memo(Dashboard);