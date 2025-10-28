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
  IconExternalLink,
  IconArrowLeft,
  IconChevronRight,
  IconEye,
  IconEyeOff
} from '@tabler/icons-react';

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: <IconHome size={20} /> },
  { title: "Courses", href: "/courses", icon: <IconBook size={20} /> },
  { title: "Byte-Compiler", href: "/editor", icon: <IconEdit size={20} /> },
  { title: "Dev Den", href: "/code", icon: <IconCode size={20} /> },
  { title: "AI", href: "/ai", icon: <IconCpu size={20} /> },
];

const ExerciseDetail = () => {
  const { courseId, exerciseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [activeTheoryTab, setActiveTheoryTab] = useState('problem');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    fetchCourseData();
    if (user) {
      fetchProgress();
    }
  }, [courseId, exerciseId, user]);

  const fetchCourseData = async () => {
    try {
      const courseRes = await axios.get(`/courses/${courseId}`);
      setCourse(courseRes.data);
      
      const foundExercise = courseRes.data.exercises?.find(ex => ex.id === exerciseId);
      if (foundExercise) {
        setExercise(foundExercise);
        setCode(foundExercise.initialCode || foundExercise.codeExample || '// Write your code here');
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const progressRes = await axios.get(`/progress/${courseId}/progress`);
      setProgress(progressRes.data);
    } catch (error) {
      console.log('No progress found');
    }
  };

  const markExerciseComplete = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`/progress/${courseId}/exercises/${exerciseId}/complete`);
      await fetchProgress();
      
      if (response.data.xpEarned) {
        alert(`🎉 Exercise completed! +${response.data.xpEarned} XP earned!`);
      }
    } catch (error) {
      console.error('Error completing exercise:', error);
      alert('Error completing exercise. Please try again.');
    }
  };

  // Safe code execution function
  const executeCodeSafely = (codeToExecute, language) => {
    if (language === 'html') {
      return { success: true, output: 'HTML rendered in preview', type: 'html' };
    }

    try {
      // Capture console output
      const logs = [];
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
      };

      // Override console methods to capture output
      ['log', 'error', 'warn', 'info'].forEach(method => {
        console[method] = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };
      });

      let returnValue;
      try {
        // Use Function constructor for safer execution
        const func = new Function(codeToExecute);
        returnValue = func();
        
        if (returnValue !== undefined) {
          logs.push(`Return: ${returnValue}`);
        }
      } catch (executionError) {
        logs.push(`Error: ${executionError.toString()}`);
      }

      // Restore original console methods
      Object.keys(originalConsole).forEach(method => {
        console[method] = originalConsole[method];
      });

      return {
        success: true,
        output: logs.join('\n') || 'Code executed successfully (no output)',
        type: 'console'
      };
    } catch (error) {
      return {
        success: false,
        output: `Execution error: ${error.message}`,
        type: 'error'
      };
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    setTimeout(() => {
      try {
        const result = executeCodeSafely(code, exercise?.language);
        setOutput(result.output);
        
        // If HTML, update the iframe
        if (exercise?.language === 'html' && result.type === 'html') {
          setIframeKey(prev => prev + 1); // Force iframe refresh
        }
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  const isExerciseCompleted = () => {
    return progress?.completedExercises?.some(ex => ex.exerciseId === exerciseId);
  };

  const getLanguageDisplayName = (language) => {
    const languages = {
      javascript: 'JavaScript',
      html: 'HTML',
      css: 'CSS',
      python: 'Python',
      cpp: 'C++',
      c: 'C',
      java: 'Java'
    };
    return languages[language] || language || 'JavaScript';
  };

  const getFileExtension = (language) => {
    const extensions = {
      javascript: 'js',
      html: 'html',
      css: 'css',
      python: 'py',
      cpp: 'cpp',
      c: 'c',
      java: 'java'
    };
    return extensions[language] || 'txt';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <FloatingNavbar items={navItems} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading Exercise</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!course || !exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <FloatingNavbar items={navItems} />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Exercise not found</h1>
          <button 
            onClick={() => navigate(`/course/${courseId}`)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <FloatingNavbar items={navItems} />

      {/* Header */}
      <div className="bg-gray-900/80 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <IconArrowLeft size={20} />
              Back to Course
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{exercise.title}</h1>
              <p className="text-gray-400">{course.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold border border-blue-500/30">
                {getLanguageDisplayName(exercise.language)}
              </span>
              {user && (
                <button
                  onClick={markExerciseComplete}
                  disabled={isExerciseCompleted()}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    isExerciseCompleted()
                      ? 'bg-green-600 text-white opacity-50 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isExerciseCompleted() ? (
                    <span className="flex items-center gap-2">
                      <IconCheck size={18} />
                      Completed
                    </span>
                  ) : (
                    'Mark Complete'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Panel - Theory & Instructions */}
        <div className="flex-1 flex flex-col border-r border-gray-700 min-w-[400px] overflow-hidden">
          {/* Theory Tabs */}
          <div className="flex-shrink-0 bg-gray-800/50 border-b border-gray-700">
            <div className="flex overflow-x-auto">
              {[
                { id: 'problem', label: 'Problem' },
                { id: 'theory', label: 'Explanation' },
                { id: 'hints', label: 'Hints' },
                { id: 'references', label: 'References' },
                { id: 'solution', label: 'Solution' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTheoryTab(tab.id)}
                  className={`px-6 py-4 font-semibold text-sm border-b-2 transition-all duration-300 whitespace-nowrap ${
                    activeTheoryTab === tab.id
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theory Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTheoryTab === 'problem' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Description</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">{exercise.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Objective</h3>
                  <p className="text-gray-300">{exercise.objective}</p>
                </div>

                {exercise.requirements && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                    <ul className="text-gray-300 space-y-2">
                      {exercise.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <IconChevronRight size={16} className="text-green-400 mt-1 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-gray-400">Difficulty</div>
                    <div className={`font-semibold ${
                      exercise.difficulty?.toLowerCase() === 'easy' ? 'text-green-400' :
                      exercise.difficulty?.toLowerCase() === 'medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {exercise.difficulty}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-gray-400">Language</div>
                    <div className="font-semibold text-white">{getLanguageDisplayName(exercise.language)}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-gray-400">Duration</div>
                    <div className="font-semibold text-white">{exercise.duration}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-gray-400">File Type</div>
                    <div className="font-semibold text-white">.{getFileExtension(exercise.language)}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTheoryTab === 'theory' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Theory & Explanation</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                    {exercise.theory}
                  </p>
                </div>

                {exercise.codeExample && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Example Code</h3>
                    <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm border border-gray-700">
                      <code className="text-gray-300">{exercise.codeExample}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {activeTheoryTab === 'hints' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Hints & Tips</h2>
                {exercise.hints && exercise.hints.length > 0 ? (
                  <div className="space-y-4">
                    {exercise.hints.map((hint, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-yellow-500">
                        <div className="flex items-start gap-3">
                          <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-sm font-semibold flex-shrink-0">
                            Hint {index + 1}
                          </span>
                          <p className="text-gray-300 flex-1">{hint}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No hints available for this exercise.</p>
                )}
              </div>
            )}

            {activeTheoryTab === 'references' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Study References</h2>
                {exercise.references && exercise.references.length > 0 ? (
                  <div className="space-y-4">
                    {exercise.references.map((reference, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                        <h3 className="text-lg font-semibold mb-2">{reference.title}</h3>
                        <p className="text-gray-300 mb-3">{reference.description}</p>
                        <a 
                          href={reference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                        >
                          <IconExternalLink size={16} />
                          Visit Resource
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No references available for this exercise.</p>
                )}
              </div>
            )}

            {activeTheoryTab === 'solution' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Solution</h2>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                  >
                    {showSolution ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    {showSolution ? 'Hide Solution' : 'Show Solution'}
                  </button>
                </div>
                
                {showSolution ? (
                  <div className="space-y-4">
                    <p className="text-gray-300">Here's the complete solution for this exercise:</p>
                    <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm border border-green-500/30">
                      <code className="text-gray-300">{exercise.solutionCode}</code>
                    </pre>
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                      <p className="text-green-300 text-sm">
                        <strong>Tip:</strong> Try to solve the exercise yourself first before looking at the solution. 
                        Learning happens through struggle and practice!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6 text-center">
                    <IconEyeOff size={32} className="mx-auto mb-3 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-yellow-200 mb-2">Solution Hidden</h3>
                    <p className="text-yellow-100">
                      Click the "Show Solution" button to reveal the complete answer. 
                      We recommend trying to solve it yourself first!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor & Output */}
        <div className="flex-1 flex flex-col min-w-[500px] overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 border-b border-gray-700">
            <div className="h-full bg-gray-900 flex flex-col">
              <div className="flex-shrink-0 bg-gray-800/50 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-400 text-sm font-mono">
                    exercise.{getFileExtension(exercise.language)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({getLanguageDisplayName(exercise.language)})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {isRunning ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <IconPlayerPlay size={16} />
                    )}
                    Run Code
                  </button>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-gray-900 text-white font-mono p-4 resize-none focus:outline-none text-sm leading-relaxed"
                spellCheck="false"
                placeholder={`Write your ${getLanguageDisplayName(exercise.language)} code here...`}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex-1 flex flex-col">
            <div className="flex-shrink-0 bg-gray-800/50 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold">
                {exercise.language === 'html' ? 'Preview' : 'Output'}
              </h3>
              <span className="text-xs text-gray-400">
                {exercise.language === 'html' ? 'Live HTML Preview' : 'Console Output'}
              </span>
            </div>
            
            <div className="flex-1 p-4 bg-black/20 overflow-auto">
              {exercise.language === 'html' ? (
                <iframe
                  key={iframeKey}
                  srcDoc={code}
                  title="html-preview"
                  className="w-full h-full bg-white rounded-lg"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <pre className="font-mono text-sm text-slate-200 h-full overflow-auto whitespace-pre-wrap bg-black/50 p-4 rounded-lg">
                  {output || `Run your ${getLanguageDisplayName(exercise.language)} code to see the output here...`}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;