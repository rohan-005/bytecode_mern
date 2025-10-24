import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Footer from "../components/Footer";

// Reusable Components
const StatCard = React.memo(({ stat }) => (
  <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-purple-500 transition duration-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-300 font-medium">{stat.label}</h3>
      <span className="text-2xl">{stat.emoji}</span>
    </div>
    <div className="flex items-baseline">
      <span className="text-3xl font-bold text-white mr-2">{stat.value}</span>
      <span className="text-gray-400">{stat.unit}</span>
    </div>
    <div className="mt-2">
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${stat.color} transition-all duration-500`}
          style={{ width: `${Math.min(stat.value, 100)}%` }}
        />
      </div>
    </div>
  </div>
));

const CourseItem = React.memo(({ enrollment }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-700 rounded-lg transition duration-200 border border-transparent hover:border-purple-500">
    <div className="flex-1">
      <h4 className="font-semibold text-white mb-1">{enrollment.course.name}</h4>
      <p className="text-sm text-gray-400">
        Level: {enrollment.course.level} • {enrollment.course.duration}
      </p>
    </div>
    <div className="flex items-center space-x-3">
      <div className="w-24 bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${enrollment.enrollment.progress}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-300 min-w-12">
        {Math.round(enrollment.enrollment.progress)}%
      </span>
    </div>
  </div>
));

const ActivityItem = React.memo(({ activity }) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-700 rounded-lg transition duration-200">
    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-white">
        <span className="font-semibold">{activity.action}</span>{" "}
        {activity.course && <span>{activity.course}</span>}
        {activity.badge && <span>"{activity.badge}" badge</span>}
      </p>
      <p className="text-sm text-gray-400 mt-1">{activity.time}</p>
    </div>
  </div>
));

const QuickActionItem = React.memo(({ action }) => (
  <Link
    to={action.path}
    className="flex items-center justify-center p-4 border-2 border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-900/20 transition duration-200 group"
  >
    <div className="text-center">
      <span className="text-2xl mb-2 block">{action.icon}</span>
      <span className="font-medium text-white group-hover:text-purple-300">
        {action.label}
      </span>
    </div>
  </Link>
));

const LogoutButton = React.memo(({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-lg flex items-center gap-2"
  >
    <svg
      className="w-5 h-5"
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
    Logout
  </button>
));

const DashboardCard = React.memo(
  ({ title, viewAllLink, children, className = "" }) => (
    <div
      className={`bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 ${className}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-purple-400 hover:text-purple-300 font-medium text-sm"
          >
            View All →
          </Link>
        )}
      </div>
      {children}
    </div>
  )
);

const CoursesSection = React.memo(({ enrolledCourses }) => (
  <DashboardCard title="My Courses" viewAllLink="/courses">
    <div className="space-y-4">
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-400 mb-4">You haven't enrolled in any courses yet</p>
          <Link
            to="/courses"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
          >
            Browse Courses
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

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userStats, setUserStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    averageProgress: 0,
    totalHours: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const QUICK_ACTIONS = [
    { icon: "🏃", label: "Practice Coding", path: "/practice" },
    { icon: "🛠️", label: "Work on Projects", path: "/projects" },
    { icon: "👥", label: "Join Community", path: "/community" },
    { icon: "⚙️", label: "Settings", path: "/settings" },
  ];

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔄 Fetching enrolled courses for dashboard...');
      // setDebugInfo('Fetching enrolled courses...');
      
      if (!token) {
        console.error('❌ No token found in localStorage');
        // setDebugInfo('No authentication token found');
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
      console.log('📊 Number of enrolled courses:', data.length);
      
      if (data.length > 0) {
        console.log('🔍 Sample enrollment data:', data[0]);
      }

      setEnrolledCourses(data);
      // setDebugInfo(`✅ Loaded ${data.length} enrolled courses`);
      
    } catch (error) {
      console.error('❌ Error fetching enrolled courses:', error);
      // setDebugInfo(`❌ Error: ${error.message}`);
    }
  };

  // Fetch user stats
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/courses/user/stats', {
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

  // Generate recent activity from enrolled courses
  const generateRecentActivity = (courses) => {
    const activities = [];
    
    courses.forEach(enrollment => {
      if (enrollment.enrollment.progress > 0) {
        activities.push({
          id: enrollment.enrollment._id,
          action: "Progress",
          course: enrollment.course.name,
          progress: enrollment.enrollment.progress,
          time: "Recently"
        });
      }
      
      if (enrollment.enrollment.completedExercises.length > 0) {
        activities.push({
          id: `${enrollment.enrollment._id}-exercise`,
          action: "Completed exercise",
          course: enrollment.course.name,
          time: "Recently"
        });
      }
    });

    // Sort by most recent and take top 3
    return activities.slice(0, 3);
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

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      setRecentActivity(generateRecentActivity(enrolledCourses));
    }
  }, [enrolledCourses]);

  const USER_STATS = [
    {
      label: "Courses Enrolled",
      value: userStats.totalCourses,
      unit: "",
      emoji: "📚",
      color: "bg-blue-500",
    },
    {
      label: "Average Progress",
      value: userStats.averageProgress,
      unit: "%",
      emoji: "📈",
      color: "bg-orange-500",
    },
    {
      label: "Courses Completed",
      value: userStats.completedCourses,
      unit: "",
      emoji: "✅",
      color: "bg-yellow-500",
    },
    {
      label: "Hours Learned",
      value: userStats.totalHours,
      unit: "h",
      emoji: "⏰",
      color: "bg-green-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Welcome Section */}
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
            {/* <div>
              <p className="font-semibold text-gray-300">Member Since</p>
              <p className="text-purple-200">{new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-300">Enrolled Courses</p>
              <p className="text-purple-200">{userStats.totalCourses} courses</p>
            </div> */}
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {USER_STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Courses */}
          <CoursesSection enrolledCourses={enrolledCourses} />

          {/* Recent Activity */}
          <DashboardCard title="Recent Activity">
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No recent activity</p>
                  <p className="text-gray-500 text-sm mt-2">Start learning to see your activity here!</p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              )}
            </div>
          </DashboardCard>

          {/* Quick Actions */}
          <DashboardCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-4">
              {QUICK_ACTIONS.map((action, index) => (
                <QuickActionItem key={index} action={action} />
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default React.memo(Dashboard);