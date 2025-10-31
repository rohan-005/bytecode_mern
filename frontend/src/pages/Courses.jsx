import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
// import PillNav from "../components/FloatingNavbar";
// import logo from "../assets/logo.png";
import { FloatingNavbar } from "../components/FloatingNavbar";
import {
  IconHome,
  IconBooks,
  IconCode,
  IconCpu,
  IconEdit,
} from "@tabler/icons-react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();

  const API_BASE = "https://bytecode-qsew.onrender.com/api";

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE}/courses`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const enrollInCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/courses/${courseId}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Show success animation
        const button = document.getElementById(`enroll-btn-${courseId}`);
        if (button) {
          button.innerHTML = "✅ Enrolled!";
          button.classList.remove("bg-purple-600", "hover:bg-purple-700");
          button.classList.add("bg-green-600", "cursor-default");
          setTimeout(() => {
            fetchEnrolledCourses();
          }, 1500);
        }
      } else {
        // eslint-disable-next-line no-unused-vars
        const error = await response.json();
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some((ec) => ec.enrollment.courseId === courseId);
  };

  const getEnrollmentProgress = (courseId) => {
    const enrollment = enrolledCourses.find(
      (ec) => ec.enrollment.courseId === courseId
    );
    return enrollment ? enrollment.enrollment.progress : 0;
  };

  // Get unique categories from courses
  const categories = [
    "all",
    ...new Set(courses.map((course) => course.category).filter(Boolean)),
  ];

  const filteredCourses = courses
    .filter((course) => {
      const matchesFilter = filter === "all" || course.level === filter;
      const matchesCategory =
        activeCategory === "all" || course.category === activeCategory;
      const matchesSearch =
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.tags &&
          course.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ));
      return matchesFilter && matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "students":
          return (b.students || 0) - (a.students || 0);
        case "duration":
          return a.duration.localeCompare(b.duration);
        default:
          return (b.students || 0) - (a.students || 0);
      }
    });

  const CourseSkeleton = () => (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-700 rounded w-16"></div>
      </div>
      <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
      <div className="flex justify-between mb-4">
        <div className="h-4 bg-gray-700 rounded w-20"></div>
        <div className="h-4 bg-gray-700 rounded w-16"></div>
      </div>
      <div className="h-10 bg-gray-700 rounded w-full"></div>
    </div>
  );
  const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: <IconHome /> },
  { title: "Courses", href: "/courses", icon: <IconBooks /> },
  { title: "Byte-Compiler", href: "/editor", icon: <IconEdit size={20} /> },
  { title: "Dev Den", href: "/code", icon: <IconCode /> },
  { title: "AI", href: "/byteai", icon: <IconCpu /> },

  // { title: "Tools", href: "/tools", icon: <IconTools /> },
  // { title: "GitHub", href: "https://github.com", icon: <IconBrandGithub /> },
];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <FloatingNavbar items={navItems} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Loading Pathways
            </h2>
            <p className="text-gray-400">
              Discovering amazing learning opportunities...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CourseSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Navigation */}
      <FloatingNavbar items={navItems} />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 "></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-3xl ">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6 font-transformer">
              Learning Pathways
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Embark on your coding journey with curated pathways designed to
              transform beginners into skilled developers
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <input
                type="text"
                placeholder="Search pathways, technologies, or concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="container mx-auto px-4 pb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & Level Filters */}
          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="students">Most Students</option>
              <option value="duration">Shortest First</option>
            </select>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400">
            Showing{" "}
            <span className="text-white font-semibold">
              {filteredCourses.length}
            </span>{" "}
            pathways
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{enrolledCourses.length} pathways enrolled</span>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCourses.map((course) => {
            const enrolled = isEnrolled(course.id);
            const progress = getEnrollmentProgress(course.id);

            return (
              <div
                key={course.id}
                className="h-80 group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:scale-105"
              >
                {/* Course Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                      {course.name}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.level === "Beginner"
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : course.level === "Intermediate"
                        ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {course.level}
                  </span>
                </div>

                {/* Course Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>

                {/* Course Meta */}
                {/* <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">👨‍🏫</span>
                      </div>
                      {course.instructor}
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-5 h-5 bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-xs">⏱️</span>
                      </div>
                      {course.duration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-white font-semibold">
                        {course.rating || "4.5"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">👥</span>
                      <span className="text-white font-semibold">
                        {course.students || "0"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      course.price === 0
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                    }`}
                  >
                    {course.price === 0 ? "FREE" : `$${course.price}`}
                  </span>
                </div> */}

                {/* Progress for enrolled courses */}
                {enrolled && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Your Progress</span>
                      <span className="font-semibold">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {enrolled ? (
                  <Link
                    to={`/course/${course.id}`}
                    className=" absolute bottom-5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 flex items-center justify-center gap-2 group/btn"
                  >
                    <span>
                      {progress === 100
                        ? "🎉 Completed"
                        : "🚀 Continue Learning"}
                    </span>
                    <svg
                      className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                ) : (
                  <button
                    id={`enroll-btn-${course.id}`}
                    onClick={() => enrollInCourse(course.id)}
                    className=" absolute bottom-5  bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Start Learning</span>
                    <svg
                      className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl">🔍</div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No pathways found
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              We couldn't find any pathways matching your criteria. Try
              adjusting your search or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilter("all");
                setActiveCategory("all");
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
