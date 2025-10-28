import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axiosConfig';
import { FloatingNavbar } from '../components/FloatingNavbar';
import {
  IconHome,
  IconBook,
  IconCode,
  IconCpu,
  IconEdit,
  IconCheck,
  IconPlayerPlay,
  IconVideo,
  IconStar,
  IconTrophy,
  IconClock,
  IconUser
} from '@tabler/icons-react';
import Footer from '../components/Footer';

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: <IconHome size={20} /> },
  { title: "Courses", href: "/courses", icon: <IconBook size={20} /> },
  { title: "Byte-Compiler", href: "/editor", icon: <IconEdit size={20} /> },
  { title: "Dev Den", href: "/code", icon: <IconCode size={20} /> },
  { title: "AI", href: "/ai", icon: <IconCpu size={20} /> },
];

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
    if (user) {
      fetchUserStats();
    }
  }, [courseId, user]);

  const fetchCourseData = async () => {
    try {
      const courseRes = await axios.get(`/courses/${courseId}`);
      setCourse(courseRes.data);
      
      if (user) {
        try {
          const progressRes = await axios.get(`/progress/${courseId}/progress`);
          setProgress(progressRes.data);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
          // If no progress found, that's okay - user isn't enrolled yet
          setProgress(null);
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get('/progress/stats');
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const enrollInCourse = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`/courses/${courseId}/enroll`);
      // Refresh progress data after enrollment
      fetchCourseData();
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const markExerciseComplete = async (exerciseId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // First, ensure user is enrolled in the course
      if (!progress) {
        await enrollInCourse();
      }

      const response = await axios.post(`/progress/${courseId}/exercises/${exerciseId}/complete`);
      await fetchCourseData();
      await fetchUserStats();
      
      // Show success notification
      if (response.data.xpEarned) {
        alert(`🎉 Exercise completed! +${response.data.xpEarned} XP earned!`);
      }
    } catch (error) {
      console.error('Error completing exercise:', error);
      if (error.response?.status === 404) {
        alert('Error: Course progress system not available. Please try again later.');
      } else {
        alert('Error completing exercise. Please try again.');
      }
    }
  };

  const markLessonComplete = async (lessonId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // First, ensure user is enrolled in the course
      if (!progress) {
        await enrollInCourse();
      }

      await axios.post(`/progress/${courseId}/lessons/${lessonId}/complete`);
      await fetchCourseData();
      alert('✅ Lesson marked as completed!');
    } catch (error) {
      console.error('Error completing lesson:', error);
      alert('Error completing lesson. Please try again.');
    }
  };

  const isExerciseCompleted = (exerciseId) => {
    return progress?.completedExercises?.some(ex => ex.exerciseId === exerciseId);
  };

  const isLessonCompleted = (lessonId) => {
    return progress?.completedLessons?.some(lesson => lesson.lessonId === lessonId);
  };

  const getExerciseXP = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 10;
      case 'medium': return 25;
      case 'hard': return 50;
      default: return 10;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <FloatingNavbar items={navItems} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading Course</h2>
            <p className="text-gray-400">Getting everything ready for you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <FloatingNavbar items={navItems} />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Course not found</h1>
          <button 
            onClick={() => navigate('/courses')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <FloatingNavbar items={navItems} />

      {/* Course Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Image */}
            <div className="lg:col-span-1">
              <img 
                src={course.image || '/images/default-course.jpg'} 
                alt={course.name}
                className="w-full h-64 lg:h-80 object-cover rounded-2xl shadow-2xl"
              />
            </div>

            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold border border-green-500/30">
                      {course.level}
                    </span>
                    <span className="text-yellow-400 flex items-center gap-1">
                      <IconStar size={16} />
                      {course.rating}
                    </span>
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
                    {course.name}
                  </h1>
                  
                  <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Course Meta */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <IconUser size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Instructor</div>
                      <div className="font-semibold">{course.instructor}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <IconClock size={20} className="text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Duration</div>
                      <div className="font-semibold">{course.duration}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <IconTrophy size={20} className="text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Level</div>
                      <div className="font-semibold">{course.level}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <IconStar size={20} className="text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Rating</div>
                      <div className="font-semibold">{course.rating}/5</div>
                    </div>
                  </div>
                </div>

                {/* User Stats */}
                {userStats && (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <IconTrophy className="text-yellow-400" size={24} />
                        <div>
                          <div className="text-2xl font-bold">Level {userStats.level}</div>
                          <div className="text-sm text-gray-400">{userStats.totalXP} XP</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <IconStar className="text-blue-400" size={24} />
                        <div>
                          <div className="text-2xl font-bold">{userStats.completedExercises}</div>
                          <div className="text-sm text-gray-400">Exercises Completed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                {progress && (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold">Your Progress</span>
                      <span className="text-green-400 font-bold">{Math.round(progress.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Enroll Button for non-enrolled users */}
                {!progress && user && (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="text-center">
                      <p className="text-gray-300 mb-4">Start your learning journey with this course!</p>
                      <button 
                        onClick={enrollInCourse}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
                      >
                        Enroll in Course
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Tabs */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {['overview', 'exercises', 'lessons'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-1 font-semibold text-sm border-b-2 transition-all duration-300 ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} 
                {tab === 'exercises' && ` (${course.exercises?.length || 0})`}
                {tab === 'lessons' && ` (${course.lessons?.length || 0})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* What You'll Learn */}
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.whatYouLearn?.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <IconCheck className="text-green-400 flex-shrink-0" size={20} />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">Prerequisites</h2>
              <div className="space-y-2">
                {course.prerequisites?.map((item, index) => (
                  <div key={index} className="text-gray-300">• {item}</div>
                ))}
              </div>
            </div>

            {/* Course Details */}
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">About This Course</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  <p className="text-gray-300">{course.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Students</h3>
                  <p className="text-gray-300">{course.students?.toLocaleString()}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags?.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exercises' && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Hands-on Exercises</h2>
            {!user && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-6">
                <p className="text-yellow-200 text-center">
                  Please log in to complete exercises and track your progress.
                </p>
              </div>
            )}
            <div className="space-y-6">
              {course.exercises?.map((exercise, index) => {
                const completed = isExerciseCompleted(exercise.id);
                const xpValue = getExerciseXP(exercise.difficulty);
                
                return (
                  <div 
                    key={exercise.id}
                    className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{exercise.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty}
                          </span>
                          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold border border-gray-600">
                            {exercise.duration}
                          </span>
                          <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-500/30">
                            +{xpValue} XP
                          </span>
                          {completed && (
                            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/30 flex items-center gap-1">
                              <IconCheck size={14} />
                              Completed
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-300 mb-4">{exercise.description}</p>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <span className="text-lg">📚</span> Theory
                            </h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{exercise.theory}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <span className="text-lg">💻</span> Code Example
                            </h4>
                            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm border border-gray-700">
                              <code className="text-gray-300">{exercise.codeExample}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 flex-wrap">
                      <button 
                        onClick={() => navigate(`/editor?course=${courseId}&exercise=${exercise.id}`)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                      >
                        <IconPlayerPlay size={18} />
                        Open in Editor
                      </button>
                      
                      {user && !completed ? (
                        <button 
                          onClick={() => markExerciseComplete(exercise.id)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                          Mark Complete
                        </button>
                      ) : user && completed ? (
                        <button 
                          disabled
                          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 opacity-50 cursor-not-allowed"
                        >
                          <IconCheck size={18} />
                          Completed
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Video Lessons</h2>
            {!user && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-6">
                <p className="text-yellow-200 text-center">
                  Please log in to track your lesson progress.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.lessons?.map((lesson, index) => {
                const completed = isLessonCompleted(lesson.id);
                
                return (
                  <div 
                    key={lesson.id}
                    className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{lesson.title}</h3>
                          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold border border-gray-600">
                            {lesson.duration}
                          </span>
                          {completed && (
                            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/30 flex items-center gap-1">
                              <IconCheck size={14} />
                              Watched
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-300">{lesson.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 flex-wrap">
                      <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2">
                        <IconVideo size={18} />
                        Watch Video
                      </button>
                      
                      {user && !completed ? (
                        <button 
                          onClick={() => markLessonComplete(lesson.id)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                        >
                          Mark as Watched
                        </button>
                      ) : user && completed ? (
                        <button 
                          disabled
                          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 opacity-50 cursor-not-allowed"
                        >
                          <IconCheck size={18} />
                          Watched
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;