import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
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
        toast.success("Enrolled in course track successfully!");
        const button = document.getElementById(`enroll-btn-${courseId}`);
        if (button) {
          button.innerHTML = "ENROLLED";
          button.className = "bytecode-btn-secondary w-full text-sm text-[#35C759] border-[#35C759]";
          setTimeout(() => {
            fetchEnrolledCourses();
          }, 1200);
        }
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to enroll in course track.");
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
      <div className="min-h-screen bg-[#1B1B1B] text-white font-outfit">
        <FloatingNavbar items={navItems} />
        <div className="max-w-[1800px] mx-auto px-8 py-20">
          <div className="text-center py-12">
            <h2 className="text-4xl font-bebas text-white tracking-wide mb-3">LOADING CURRICULUM</h2>
            <p className="text-sm text-[#8E8E8E] font-mono">Fetching course tracks...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-white font-outfit flex flex-col justify-between">
      <FloatingNavbar items={navItems} />

      {/* Widescreen Main Container */}
      <div className="w-full max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-16 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bebas text-white tracking-wider mb-3">
            LEARNING PATHWAYS
          </h1>
          <p className="text-lg text-[#CFCFCF] font-outfit max-w-2xl mx-auto leading-relaxed">
            Curated developer curriculum designed to transform beginners into senior engineers.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mt-8">
            <input
              type="text"
              placeholder="Search tracks, technologies, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bytecode-input w-full pl-12 pr-6 text-base py-4"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8E8E8E]">
              <IconSearch size={20} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8 pb-6 border-b border-[#4A4A4A]">
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors font-mono ${
                  activeCategory === category
                    ? "bg-[#FF6A2A] text-white border border-[#FF6A2A]"
                    : "bg-[#252422] text-[#CFCFCF] border border-[#4A4A4A] hover:border-[#FF6A2A]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bytecode-input text-xs py-2 px-4 flex-1"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="students">Most Students</option>
              <option value="duration">Shortest First</option>
            </select>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bytecode-input text-xs py-2 px-4 flex-1"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center mb-8 text-sm text-[#8E8E8E] font-mono">
          <span>SHOWING {filteredCourses.length} PATHWAY TRACKS</span>
          <span className="text-[#35C759] font-bold">{enrolledCourses.length} ENROLLED</span>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredCourses.map((course) => {
            const enrolled = isEnrolled(course.id);
            const progress = getEnrollmentProgress(course.id);

            return (
              <div
                key={course.id}
                className="bytecode-card p-8 flex flex-col justify-between hover:border-[#FF6A2A] transition-colors relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-4 gap-3">
                    <h3 className="text-2xl font-bebas text-white tracking-wide leading-snug">
                      {course.name}
                    </h3>
                    <span className="text-xs font-mono uppercase px-2.5 py-1 bg-[#252422] border border-[#4A4A4A] text-[#FF6A2A] whitespace-nowrap">
                      {course.level}
                    </span>
                  </div>

                  <p className="text-sm text-[#CFCFCF] mb-8 line-clamp-3 leading-relaxed font-outfit">
                    {course.description}
                  </p>
                </div>

                <div>
                  {enrolled && (
                    <div className="mb-6">
                      <div className="flex justify-between text-xs font-mono text-[#CFCFCF] mb-1.5">
                        <span>Track Progress</span>
                        <span className="text-[#35C759] font-bold">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-[#252422] h-2 border border-[#4A4A4A]">
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
                      className="bytecode-btn-secondary w-full text-sm py-3 flex items-center justify-center gap-2 text-[#35C759] border-[#35C759]"
                    >
                      <span>{progress === 100 ? "Completed Track" : "Continue Learning"}</span>
                      <IconArrowRight size={16} />
                    </Link>
                  ) : (
                    <button
                      id={`enroll-btn-${course.id}`}
                      onClick={() => enrollInCourse(course.id)}
                      className="bytecode-btn-primary w-full text-sm py-3 flex items-center justify-center gap-2"
                    >
                      <span>Start Learning Track</span>
                      <IconArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && !loading && (
          <div className="bytecode-card p-16 text-center my-12">
            <h3 className="text-3xl font-bebas text-white tracking-wide mb-3">NO PATHWAYS MATCHED</h3>
            <p className="text-sm text-[#8E8E8E] font-mono mb-6">Try clearing filters or search queries.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilter("all");
                setActiveCategory("all");
              }}
              className="bytecode-btn-primary text-sm"
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
