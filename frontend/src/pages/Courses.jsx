import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  // Update the fetchCourses function in Courses.jsx
const fetchCourses = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/courses');
    if (response.ok) {
      const data = await response.json();
      setCourses(data);
    } else {
      console.error('Failed to fetch courses:', response.status);
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
  } finally {
    setLoading(false);
  }
};

// Update the fetchEnrolledCourses function in Courses.jsx
const fetchEnrolledCourses = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/courses/user/enrolled', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      setEnrolledCourses(data);
    } else {
      console.error('Failed to fetch enrolled courses:', response.status);
    }
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
  }
};

// Update the enrollInCourse function in Courses.jsx
const enrollInCourse = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      // eslint-disable-next-line no-unused-vars
      const result = await response.json();
      alert('Successfully enrolled in course!');
      fetchEnrolledCourses(); // Refresh enrolled courses
    } else {
      const error = await response.json();
      alert(error.message);
    }
  } catch (error) {
    console.error('Error enrolling in course:', error);
    alert('Error enrolling in course');
  }
};

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(ec => ec.enrollment.courseId === courseId);
  };

  const getEnrollmentProgress = (courseId) => {
    const enrollment = enrolledCourses.find(ec => ec.enrollment.courseId === courseId);
    return enrollment ? enrollment.enrollment.progress : 0;
  };

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === 'all' || course.level === filter;
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Available Courses</h1>
          <p className="text-gray-400">Enroll in courses and start your learning journey</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const enrolled = isEnrolled(course.id);
            const progress = getEnrollmentProgress(course.id);
            
            return (
              <div key={course.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition duration-200 hover:shadow-lg">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white flex-1">{course.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ml-2 ${
                      course.level === 'Beginner' ? 'bg-green-900 text-green-300' :
                      course.level === 'Intermediate' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span>👨‍🏫 {course.instructor}</span>
                    <span>⏱️ {course.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">⭐ {course.rating}</span>
                    <span className="text-gray-400">👥 {course.students}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    course.price === 0 ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'
                  }`}>
                    {course.price === 0 ? 'FREE' : `$${course.price}`}
                  </span>
                </div>

                {/* Progress for enrolled courses */}
                {enrolled && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {enrolled ? (
                  <Link
                    to={`/course/${course.id}`}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-200 text-center block"
                  >
                    {progress === 100 ? 'Completed' : 'Continue Learning'}
                  </Link>
                ) : (
                  <button
                    onClick={() => enrollInCourse(course.id)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-200"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Courses;