import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { FloatingNavbar } from "../components/FloatingNavbar";
import { SkeletonCard } from "../components/SkeletonLoader";
import {
  IconHome,
  IconBooks,
  IconCode,
  IconCpu,
  IconEdit,
  IconSearch,
  IconCheck,
  IconArrowRight,
  IconFilter
} from "@tabler/icons-react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const { user } = useAuth();

  const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:5000/api');

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
        const button = document.getElementById(`enroll-btn-${courseId}`);
        if (button) {
          button.innerHTML = "✅ ENROLLED!";
          button.className = "bytecode-btn-secondary w-full text-xs text-[#35C759] border-[#35C759]";
          setTimeout(() => {
            fetchEnrolledCourses();
          }, 1200);
        }
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

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: <IconHome /> },
    { title: "Courses", href: "/courses", icon: <IconBooks /> },
    { title: "Byte-Compiler", href: "/editor", icon: <IconEdit size={20} /> },
    { title: "Dev Den", href: "/devden", icon: <IconCode /> },
    { title: "AI", href: "/byteai", icon: <IconCpu /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B1B1B] text-white font-jetbrains">
        <FloatingNavbar items={navItems} />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center py-10">
            <h2 className="text-3xl font-bebas text-white tracking-wide mb-2">LOADING CURRICULUM</h2>
            <p className="text-xs text-[#8E8E8E] font-mono">Fetching course tracks...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-white font-jetbrains flex flex-col justify-between">
      <FloatingNavbar items={navItems} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl sm:text-6xl font-bebas text-white tracking-wider mb-2">
            LEARNING PATHWAYS
          </h1>
          <p className="text-xs sm:text-sm text-[#CFCFCF] font-mono max-w-xl mx-auto leading-relaxed">
            Curated developer curriculum designed to transform beginners into senior engineers.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mt-6">
            <input
              type="text"
              placeholder="Search tracks, technologies, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bytecode-input w-full pl-10 pr-4 text-xs py-3"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8E8E8E]">
              <IconSearch size={16} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 pb-6 border-b border-[#4A4A4A]">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeCategory === category
                    ? "bg-[#FF6A2A] text-white border border-[#FF6A2A]"
                    : "bg-[#252422] text-[#CFCFCF] border border-[#4A4A4A] hover:border-[#FF6A2A]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bytecode-input text-xs py-1.5 flex-1"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="students">Most Students</option>
              <option value="duration">Shortest First</option>
            </select>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bytecode-input text-xs py-1.5 flex-1"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center mb-6 text-xs text-[#8E8E8E] font-mono">
          <span>SHOWING {filteredCourses.length} PATHWAY TRACKS</span>
          <span className="text-[#35C759]">{enrolledCourses.length} ENROLLED</span>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCourses.map((course) => {
            const enrolled = isEnrolled(course.id);
            const progress = getEnrollmentProgress(course.id);

            return (
              <div
                key={course.id}
                className="bytecode-card p-6 flex flex-col justify-between hover:border-[#FF6A2A] transition-colors relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="text-xl font-bebas text-white tracking-wide leading-snug">
                      {course.name}
                    </h3>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[#252422] border border-[#4A4A4A] text-[#FF6A2A] whitespace-nowrap">
                      {course.level}
                    </span>
                  </div>

                  <p className="text-xs text-[#CFCFCF] mb-6 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div>
                  {enrolled && (
                    <div className="mb-4">
                      <div className="flex justify-between text-[11px] font-mono text-[#CFCFCF] mb-1">
                        <span>Track Progress</span>
                        <span className="text-[#35C759] font-bold">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-[#252422] h-1.5 border border-[#4A4A4A]">
                        <div
                          className="h-full bg-[#35C759]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {enrolled ? (
                    <Link
                      to={`/course/${course.id}`}
                      className="bytecode-btn-secondary w-full text-xs py-2.5 flex items-center justify-center gap-2 text-[#35C759] border-[#35C759]"
                    >
                      <span>{progress === 100 ? "🎉 Completed" : "Continue Learning"}</span>
                      <IconArrowRight size={14} />
                    </Link>
                  ) : (
                    <button
                      id={`enroll-btn-${course.id}`}
                      onClick={() => enrollInCourse(course.id)}
                      className="bytecode-btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2"
                    >
                      <span>Start Learning Track</span>
                      <IconArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && !loading && (
          <div className="bytecode-card p-12 text-center my-8">
            <h3 className="text-2xl font-bebas text-white tracking-wide mb-2">NO PATHWAYS MATCHED</h3>
            <p className="text-xs text-[#8E8E8E] font-mono mb-4">Try clearing filters or search queries.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilter("all");
                setActiveCategory("all");
              }}
              className="bytecode-btn-primary text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
