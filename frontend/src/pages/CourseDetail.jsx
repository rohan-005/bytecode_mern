/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axiosConfig';
import { FloatingNavbar } from '../components/FloatingNavbar';
import { SkeletonCard } from '../components/SkeletonLoader';
import {
  IconHome,
  IconBook,
  IconCode,
  IconCpu,
  IconEdit,
  IconCheck,
  IconPlayerPlay,
  IconExternalLink,
  IconStar,
  IconTrophy,
  IconClock,
  IconUser,
  IconArrowLeft
} from '@tabler/icons-react';
import Footer from '../components/Footer';

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: <IconHome size={20} /> },
  { title: "Courses", href: "/courses", icon: <IconBook size={20} /> },
  { title: "Byte-Compiler", href: "/editor", icon: <IconEdit size={20} /> },
  { title: "Dev Den", href: "/devden", icon: <IconCode size={20} /> },
  { title: "AI", href: "/byteai", icon: <IconCpu size={20} /> },
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
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    fetchCourseData();
    if (user) {
      fetchUserStats();
      fetchUserRating();
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
        } catch (error) {
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

  const fetchUserRating = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`/courses/${courseId}/rating`);
      setUserRating(response.data.rating || 0);
    } catch (error) {
      console.error('Error fetching user rating:', error);
      setUserRating(0);
    }
  };

  const submitRating = async (rating) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setRatingLoading(true);
    try {
      await axios.post(`/courses/${courseId}/rate`, { rating });
      setUserRating(rating);
      await fetchCourseData();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating. Please try again.');
    } finally {
      setRatingLoading(false);
    }
  };

  const enrollInCourse = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`/courses/${courseId}/enroll`);
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
      if (!progress) {
        await enrollInCourse();
      }

      const response = await axios.post(`/progress/${courseId}/exercises/${exerciseId}/complete`);
      await fetchCourseData();
      await fetchUserStats();
      
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

  const isExerciseCompleted = (exerciseId) => {
    return progress?.completedExercises?.some(ex => ex.exerciseId === exerciseId);
  };

  const getExerciseXP = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 10;
      case 'medium': return 25;
      case 'hard': return 50;
      default: return 10;
    }
  };

  const openExerciseInEditor = (exercise) => {
    navigate(`/courses/${courseId}/exercises/${exercise.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B1B1B] text-white font-jetbrains">
        <FloatingNavbar items={navItems} />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <SkeletonCard className="h-64 mb-6" />
          <SkeletonCard className="h-40" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#1B1B1B] text-white font-jetbrains flex items-center justify-center">
        <FloatingNavbar items={navItems} />
        <div className="bytecode-card p-8 text-center max-w-md">
          <h1 className="text-2xl font-bebas text-white tracking-wide mb-4">COURSE NOT FOUND</h1>
          <button 
            onClick={() => navigate('/courses')}
            className="bytecode-btn-primary text-xs"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-white font-jetbrains flex flex-col justify-between">
      <FloatingNavbar items={navItems} />

      <div className="w-full">
        {/* Header Block */}
        <div className="bg-[#252422] border-b border-[#4A4A4A] py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate('/courses')}
              className="text-xs text-[#FF8C42] hover:text-[#FF6A2A] font-mono flex items-center gap-1 mb-4 uppercase tracking-wider transition-colors"
            >
              <IconArrowLeft size={16} />
              <span>Back to Catalog</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-1">
                <img 
                  src={course.image || '/images/default-course.jpg'} 
                  alt={course.name}
                  className="w-full h-56 object-cover border border-[#4A4A4A]"
                />
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-[#1B1B1B] border border-[#FF6A2A] text-[#FF6A2A] text-xs font-mono font-bold uppercase">
                    {course.level}
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => !ratingLoading && submitRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        disabled={ratingLoading}
                        className={`${
                          star <= (hoverRating || userRating) ? 'text-[#FFC300]' : 'text-[#8E8E8E]'
                        } transition-colors`}
                      >
                        <IconStar 
                          size={18} 
                          fill={star <= (hoverRating || userRating) ? 'currentColor' : 'none'}
                        />
                      </button>
                    ))}
                    <span className="text-[#8E8E8E] text-xs font-mono ml-2">
                      ({course.rating || 0}/5)
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl font-bebas text-white tracking-wide">
                  {course.name}
                </h1>
                
                <p className="text-xs text-[#CFCFCF] font-mono leading-relaxed max-w-2xl">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-[#1B1B1B] border border-[#4A4A4A]">
                    <div className="text-[10px] text-[#8E8E8E] uppercase tracking-wider">Exercises</div>
                    <div className="text-base font-bold text-white font-mono">{course.exercises?.length || 0}</div>
                  </div>
                  <div className="p-3 bg-[#1B1B1B] border border-[#4A4A4A]">
                    <div className="text-[10px] text-[#8E8E8E] uppercase tracking-wider">Category</div>
                    <div className="text-base font-bold text-[#FF6A2A] font-mono truncate">{course.category || "Development"}</div>
                  </div>
                  <div className="p-3 bg-[#1B1B1B] border border-[#4A4A4A]">
                    <div className="text-[10px] text-[#8E8E8E] uppercase tracking-wider">Difficulty</div>
                    <div className="text-base font-bold text-white font-mono">{course.level}</div>
                  </div>
                </div>

                {progress && (
                  <div className="p-4 bg-[#1B1B1B] border border-[#35C759]">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-[#CFCFCF]">Course Progress</span>
                      <span className="text-[#35C759] font-bold">{Math.round(progress.progress)}%</span>
                    </div>
                    <div className="w-full bg-[#252422] h-2 border border-[#4A4A4A]">
                      <div 
                        className="h-full bg-[#35C759]"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {!progress && user && (
                  <button 
                    onClick={enrollInCourse}
                    className="bytecode-btn-primary text-xs py-3 px-6"
                  >
                    Enroll in Track
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="bg-[#1B1B1B] border-b border-[#4A4A4A] sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 flex gap-6">
            {['overview', 'exercises', 'references'].map((tab) => (
              <button
                key={tab}
                className={`py-3 px-2 font-mono text-xs uppercase tracking-wider border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#FF6A2A] text-[#FF6A2A] font-bold'
                    : 'border-transparent text-[#8E8E8E] hover:text-[#CFCFCF]'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} 
                {tab === 'exercises' && ` (${course.exercises?.length || 0})`}
                {tab === 'references' && ` (${course.references?.length || 0})`}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bytecode-card p-6">
                <h2 className="text-xl font-bebas text-white tracking-wide mb-4 pb-2 border-b border-[#4A4A4A]">
                  WHAT YOU'LL LEARN
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.whatYouLearn?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-[#CFCFCF] font-mono">
                      <IconCheck className="text-[#35C759] flex-shrink-0" size={16} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="bytecode-card p-6">
                  <h2 className="text-xl font-bebas text-white tracking-wide mb-4 pb-2 border-b border-[#4A4A4A]">
                    PREREQUISITES
                  </h2>
                  <div className="space-y-2 text-xs text-[#CFCFCF] font-mono">
                    {course.prerequisites.map((item, index) => (
                      <div key={index}>• {item}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'exercises' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bebas text-white tracking-wide mb-4">HANDS-ON EXERCISES</h2>
              {course.exercises?.map((exercise, index) => {
                const completed = isExerciseCompleted(exercise.id);
                const xpValue = getExerciseXP(exercise.difficulty);
                
                return (
                  <div 
                    key={exercise.id}
                    className="bytecode-card p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#FF6A2A] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#252422] border border-[#FF6A2A] text-[#FF6A2A] flex items-center justify-center font-bebas text-xl flex-shrink-0">
                        {index + 1}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-white font-mono">{exercise.title}</h3>
                          <span className="px-2 py-0.5 bg-[#252422] border border-[#4A4A4A] text-[10px] font-mono text-[#FF6A2A] uppercase">
                            {exercise.difficulty}
                          </span>
                          <span className="px-2 py-0.5 bg-[#252422] border border-[#4A4A4A] text-[10px] font-mono text-[#35C759]">
                            +{xpValue} XP
                          </span>
                          {completed && (
                            <span className="px-2 py-0.5 bg-[#35C759]/10 border border-[#35C759] text-[10px] font-mono text-[#35C759] flex items-center gap-1">
                              <IconCheck size={12} />
                              COMPLETED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#CFCFCF] font-mono">{exercise.description}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => openExerciseInEditor(exercise)}
                        className="bytecode-btn-primary text-xs py-2 px-4 flex items-center gap-1 flex-1 md:flex-initial"
                      >
                        <IconPlayerPlay size={14} />
                        <span>Open Exercise</span>
                      </button>
                      
                      {user && !completed && (
                        <button 
                          onClick={() => markExerciseComplete(exercise.id)}
                          className="bytecode-btn-secondary text-xs py-2 px-4 flex-1 md:flex-initial"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'references' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bebas text-white tracking-wide mb-4">STUDY REFERENCES</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.references?.map((reference, index) => (
                  <div 
                    key={index}
                    className="bytecode-card p-5 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono mb-2">{reference.title}</h3>
                      <p className="text-xs text-[#CFCFCF] font-mono mb-4">{reference.description}</p>
                    </div>

                    <a 
                      href={reference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bytecode-btn-secondary text-xs py-2 px-4 self-start flex items-center gap-1 text-[#FF6A2A] border-[#FF6A2A]"
                    >
                      <IconExternalLink size={14} />
                      <span>Open External Link</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;