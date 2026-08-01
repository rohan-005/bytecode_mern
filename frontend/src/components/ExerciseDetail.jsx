/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FloatingNavbar } from "./FloatingNavbar";
import axios from "../utils/axiosConfig";
import toast from "react-hot-toast";
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
  IconEyeOff,
  IconCopy,
  IconTrophy,
  IconScreenShare,
  IconTerminal2,
  IconArrowRight,
  IconLoader2,
  IconSparkles,
  IconTarget
} from "@tabler/icons-react";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: <IconHome size={20} /> },
  { title: "Courses", href: "/courses", icon: <IconBook size={20} /> },
  { title: "Byte-Compiler", href: "/editor", icon: <IconEdit size={20} /> },
  { title: "Dev Den", href: "/devden", icon: <IconCode size={20} /> },
  { title: "AI", href: "/byteai", icon: <IconCpu size={20} /> },
];

const ExerciseDetail = () => {
  const { courseId, exerciseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [activeTheoryTab, setActiveTheoryTab] = useState("problem");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [typingEffect, setTypingEffect] = useState("");
  const [particles, setParticles] = useState([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [activeHint, setActiveHint] = useState(null);
  const [copied, setCopied] = useState(false);
  const [outputMode, setOutputMode] = useState("preview");
  const [prevExercise, setPrevExercise] = useState(null);
  const [nextExercise, setNextExercise] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const codeEditorRef = useRef(null);
  

  // API base URL - environment variable configured
  const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:5000/api');

  // Default code templates - matching your backend expectations
  const defaultCode = {
    c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    \n    // Calculate and print Fibonacci sequence\n    int n = 10;\n    int a = 0, b = 1, next;\n    \n    printf("Fibonacci sequence up to %d terms:\\n", n);\n    for (int i = 1; i <= n; i++) {\n        printf("%d ", a);\n        next = a + b;\n        a = b;\n        b = next;\n    }\n    printf("\\n");\n    \n    return 0;\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    \n    // Calculate and print Fibonacci sequence\n    int n = 10;\n    int a = 0, b = 1, next;\n    \n    cout << "Fibonacci sequence up to " << n << " terms:" << endl;\n    for (int i = 1; i <= n; i++) {\n        cout << a << " ";\n        next = a + b;\n        a = b;\n        b = next;\n    }\n    cout << endl;\n    \n    return 0;\n}`,
    css: `/* Welcome to CSS Styling! */\nbody {\n    font-family: 'Arial', sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    margin: 0;\n    padding: 40px;\n    min-height: 100vh;\n}\n\n.container {\n    max-width: 800px;\n    margin: 0 auto;\n    background: rgba(255, 255, 255, 0.95);\n    padding: 40px;\n    border-radius: 20px;\n    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);\n    text-align: center;\n}`,
    javascript: `// Welcome to JavaScript!\nconsole.log("Hello, World!");\n\n// Simple function example\nfunction greet(name) {\n    return "Hello, " + name + "!";\n}\n\n// Array operations\nconst numbers = [1, 2, 3, 4, 5];\nconst squares = numbers.map(n => n * n);\n\nconsole.log("Original numbers:", numbers);\nconsole.log("Squared numbers:", squares);\nconsole.log("Greeting:", greet("Developer"));`,
    html: `<!DOCTYPE html>\n<html>\n<head>\n    <title>ByteCode Exercise</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n            margin: 0;\n            padding: 40px;\n            color: white;\n        }\n        .container {\n            max-width: 800px;\n            margin: 0 auto;\n            background: rgba(255, 255, 255, 0.1);\n            padding: 30px;\n            border-radius: 15px;\n            backdrop-filter: blur(10px);\n        }\n    </style>\n</head>\n<body>\n    <div class="container">\n        <h1>Welcome to ByteCode!</h1>\n        <p>Edit this HTML to see changes in real-time.</p>\n    </div>\n</body>\n</html>`,
    python: `# Welcome to Python!\nprint("Hello, World!");\n\n// Simple function example\ndef greet(name):\n    return f"Hello, {name}!"\n\n// List operations\nnumbers = [1, 2, 3, 4, 5]\nsquares = [n * n for n in numbers]\n\nprint("Original numbers:", numbers)\nprint("Squared numbers:", squares)\nprint("Greeting:", greet("Developer"))`,
    java: `// Welcome to Java!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        \n        // Simple function example\n        String greeting = greet("Developer");\n        System.out.println("Greeting: " + greeting);\n    }\n    \n    public static String greet(String name) {\n        return "Hello, " + name + "!";\n    }\n}`
  };

  // Particle animation for background
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Typing effect for exercise title
  useEffect(() => {
    if (exercise?.title) {
      let i = 0;
      const typing = setInterval(() => {
        if (i <= exercise.title.length) {
          setTypingEffect(exercise.title.slice(0, i));
          i++;
        } else {
          clearInterval(typing);
        }
      }, 50);
      return () => clearInterval(typing);
    }
  }, [exercise]);

  useEffect(() => {
    fetchCourseData();
    if (user) {
      fetchProgress();
    }
  }, [courseId, exerciseId, user]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const courseRes = await axios.get(`/courses/${courseId}`);
      setCourse(courseRes.data);

      const foundExercise = courseRes.data.exercises?.find(
        (ex) => ex.id === exerciseId
      );
      
      if (foundExercise) {
        setExercise(foundExercise);
        
        // Find prev and next exercise
        const exercises = courseRes.data.exercises || [];
        const currentIndex = exercises.findIndex(ex => ex.id === exerciseId);
        const prevEx = currentIndex > 0 ? exercises[currentIndex - 1] : null;
        const nextEx = currentIndex >= 0 && currentIndex < exercises.length - 1 ? exercises[currentIndex + 1] : null;
        setPrevExercise(prevEx);
        setNextExercise(nextEx);

        // Set initial output mode based on exercise type
        const initialOutputMode = canShowPreview(foundExercise.language) ? "preview" : "console";
        setOutputMode(initialOutputMode);

        // Use exercise initial code or default code for the language
        const initialCode = foundExercise.initialCode || 
                           defaultCode[foundExercise.language] || 
                           foundExercise.codeExample || 
                           `// Write your ${getLanguageDisplayName(foundExercise.language)} code here\n// Start typing your solution...`;
        setCode(initialCode);
      } else {
        console.error("Exercise not found");
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const progressRes = await axios.get(`/progress/${courseId}/progress`);
      setProgress(progressRes.data);
    } catch (error) {
      console.log("No progress found - user may not be enrolled");
      setProgress(null);
    }
  };

  const markExerciseComplete = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isCompleting) return;

    setIsCompleting(true);
    try {
      if (!progress) {
        try {
          await axios.post(`/courses/${courseId}/enroll`);
        } catch (enrollError) {
          console.error("Error enrolling in course:", enrollError);
        }
      }

      const response = await axios.post(
        `/progress/${courseId}/exercises/${exerciseId}/complete`
      );
      await fetchProgress();

      if (response.data.xpEarned) {
        setXpEarned(response.data.xpEarned);
        setShowXpAnimation(true);
        setTimeout(() => setShowXpAnimation(false), 3000);
        toast.success(`Exercise completed! +${response.data.xpEarned} XP earned!`);
      } else {
        toast.success("Exercise completed!");
      }
    } catch (error) {
      console.error("Error completing exercise:", error);
      toast.error("Failed to mark exercise as complete.");
    } finally {
      setIsCompleting(false);
    }
  };

  // Navigate to prev/next exercise
  const goToPrevExercise = () => {
    if (prevExercise) {
      navigate(`/courses/${courseId}/exercises/${prevExercise.id}`);
    }
  };

  const goToNextExercise = () => {
    if (nextExercise) {
      navigate(`/courses/${courseId}/exercises/${nextExercise.id}`);
    } else {
      toast.success("Congratulations! Course completed!");
      navigate(`/course/${courseId}`);
    }
  };

  // Generate HTML preview for CSS
  const generateCSSPreview = (cssCode) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        ${cssCode}
        
        /* Default styles if CSS is empty */
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f0f0f0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>CSS Playground</h1>
        <p>Your CSS styles are applied to this page. Modify the CSS code to see changes.</p>
        <div class="feature">
            <h3> Feature Card</h3>
            <p>This demonstrates your CSS styling skills</p>
        </div>
    </div>
</body>
</html>`;
  };

  // Execute JavaScript code safely in browser
  const executeJavaScript = (codeToExecute) => {
    try {
      const logs = [];
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
      };

      // Override console methods to capture output
      ["log", "error", "warn", "info"].forEach((method) => {
        console[method] = (...args) => {
          logs.push(
            args
              .map((arg) =>
                typeof arg === "object"
                  ? JSON.stringify(arg, null, 2)
                  : String(arg)
              )
              .join(" ")
          );
        };
      });

      let returnValue;
      try {
        const func = new Function(codeToExecute);
        returnValue = func();

        if (returnValue !== undefined) {
          logs.push(` Return: ${returnValue}`);
        }
      } catch (executionError) {
        logs.push(` Error: ${executionError.toString()}`);
      }

      // Restore original console methods
      Object.keys(originalConsole).forEach((method) => {
        console[method] = originalConsole[method];
      });

      return {
        success: true,
        output: logs.join("\n") || " Code executed successfully (no output)",
        type: "console",
      };
    } catch (error) {
      return {
        success: false,
        output: ` Execution error: ${error.message}`,
        type: "error",
      };
    }
  };

  // Run code - using the same API endpoint as CodeEditor
  const runCode = async () => {
    setIsRunning(true);
    
    if (outputMode === 'preview') {
      setOutput(' Updating preview...');
      setTimeout(() => {
        setIframeKey(prev => prev + 1);
        setOutput(' Preview updated!');
        setIsRunning(false);
      }, 500);
      return;
    }

    setOutput(' Running your code...');
    
    try {
      // For JavaScript, run in browser
      if (exercise?.language === 'javascript') {
        const result = executeJavaScript(code);
        setOutput(result.output);
        setIsRunning(false);
        return;
      }

      // For HTML/CSS in console mode, show message
      if (exercise?.language === 'html' || exercise?.language === 'css') {
        setOutput(' This language is better viewed in Preview mode. Switch to Preview to see the output.');
        setIsRunning(false);
        return;
      }

      // For server-side languages (C, C++, Python, Java), call backend API
      const supportedServerLanguages = ['c', 'cpp', 'python', 'java'];
      if (supportedServerLanguages.includes(exercise?.language)) {
        console.log(`Sending ${exercise.language} code to backend...`);
        
        // Use the same API endpoint as your CodeEditor
        const response = await axios.post(`${API_BASE}/code/execute`, {
          language: exercise.language,
          code: code
        }, {
          timeout: 15000
        });

        console.log('Backend response:', response.data);
        
        if (response.data.success) {
          setOutput(` ${response.data.output}`);
        } else {
          setOutput(` ${response.data.output}`);
        }
        setIsRunning(false);
        return;
      }

      // Fallback for unsupported languages
      setOutput(` Language "${exercise?.language}" is not supported for execution`);
      setIsRunning(false);
      
    } catch (error) {
      console.error('Error running code:', error);
      
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        setOutput(` Network Error: Cannot connect to code execution service\n\nMake sure the backend server is running on:\n${API_BASE}/code/execute`);
      } else if (error.response?.status === 404) {
        setOutput(` Backend Service Not Found\n\nThe code execution endpoint is not available at:\n${API_BASE}/code/execute`);
      } else if (error.response?.status === 500) {
        setOutput(` Server Error\n\nThe code execution service encountered an internal error.\n\nCheck the backend server logs for details.`);
      } else if (error.message.includes('timeout')) {
        setOutput(`⏰ Timeout Error\n\nThe code execution took too long.\n\nTry simplifying your code.`);
      } else {
        setOutput(` Unexpected Error: ${error.message}`);
      }
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetCode = () => {
    const initialCode = exercise?.initialCode || 
                       defaultCode[exercise?.language] || 
                       exercise?.codeExample || 
                       `// Write your ${getLanguageDisplayName(exercise?.language)} code here`;
    setCode(initialCode);
  };

  const isExerciseCompleted = () => {
    return progress?.completedExercises?.some(
      (ex) => ex.exerciseId === exerciseId
    );
  };

  const getLanguageDisplayName = (language) => {
    const languages = {
      javascript: "JavaScript",
      html: "HTML",
      css: "CSS",
      python: "Python",
      cpp: "C++",
      c: "C",
      java: "Java",
    };
    return languages[language] || language || "Unknown";
  };

  const getFileExtension = (language) => {
    const extensions = {
      javascript: "js",
      html: "html",
      css: "css",
      python: "py",
      cpp: "cpp",
      c: "c",
      java: "java",
    };
    return extensions[language] || "txt";
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "from-green-500 to-emerald-400";
      case "medium":
        return "from-yellow-500 to-orange-400";
      case "hard":
        return "from-red-500 to-pink-400";
      default:
        return "from-gray-500 to-gray-400";
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "🟢";
      case "medium":
        return "🟡";
      case "hard":
        return "";
      default:
        return "";
    }
  };

  // Get source document for iframe preview
  const getPreviewSource = () => {
    if (exercise?.language === "html") {
      return code;
    }
    if (exercise?.language === "css") {
      return generateCSSPreview(code);
    }
    return "<html><body><h1>Preview not available for this language</h1></body></html>";
  };

  const canShowPreview = (language) => {
    return language === "html" || language === "css";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
        <FloatingNavbar items={navItems} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Loading Exercise
            </h2>
            <div className="flex justify-center gap-1 mt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
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
          <h1 className="text-2xl font-bold text-white mb-4">
            Exercise not found
          </h1>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="bytecode-btn-primary text-xs py-2.5 px-2"
          >
            Back to Track
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-purple-500/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.speed}s ease-in-out ${particle.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>
      

      <FloatingNavbar items={navItems} />

      {/* XP Earned Animation */}
      {showXpAnimation && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-center animate-bounce">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-4xl font-bold px-8 py-4 rounded-2xl shadow-2xl transform rotate-6">
               +{xpEarned} XP Earned!
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative bg-[#252422] border-b border-[#4A4A4A] font-jetbrains">
        <div className="w-full max-w-[2000px] mx-auto px-6 sm:px-12 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="text-xs text-[#FF8C42] hover:text-[#FF6A2A] transition-colors flex items-center gap-1 font-mono uppercase tracking-wider"
            >
              <IconArrowLeft size={16} />
              Back to Track
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bebas text-white tracking-wide">
                {typingEffect}
                <span className="text-[#FF6A2A] animate-pulse">|</span>
              </h1>
              <p className="text-xs text-[#8E8E8E] flex items-center gap-1.5 font-mono">
                <IconBook size={14} />
                {course.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Output Mode Toggle */}
              {canShowPreview(exercise.language) && (
                <div className="flex items-center gap-1 bg-[#1B1B1B] p-1 border border-[#4A4A4A] h-10">
                  <button
                    onClick={() => setOutputMode("preview")}
                    className={`flex items-center gap-1.5 px-3 h-8 text-xs font-mono uppercase tracking-wider transition-colors ${
                      outputMode === "preview"
                        ? "bg-[#FF6A2A] text-white font-bold"
                        : "text-[#8E8E8E] hover:text-white"
                    }`}
                  >
                    <IconScreenShare size={14} />
                    Preview
                  </button>
                  <button
                    onClick={() => setOutputMode("console")}
                    className={`flex items-center gap-1.5 px-3 h-8 text-xs font-mono uppercase tracking-wider transition-colors ${
                      outputMode === "console"
                        ? "bg-[#FF6A2A] text-white font-bold"
                        : "text-[#8E8E8E] hover:text-white"
                    }`}
                  >
                    <IconTerminal2 size={14} />
                    Console
                  </button>
                </div>
              )}

              <div className="flex items-center gap-1.5 bg-[#1B1B1B] px-4 h-10 border border-[#FF6A2A] text-xs font-mono">
                <span>{getDifficultyIcon(exercise.difficulty)}</span>
                <span className="text-[#FF6A2A] font-bold">
                  {getLanguageDisplayName(exercise.language)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex h-[calc(100vh-140px)] relative">
        {/* Left Panel - Theory & Instructions */}
        <div className="flex-1 flex flex-col border-r border-gray-700 min-w-[400px] overflow-hidden bg-gray-900/50 backdrop-blur-sm">
          {/* Theory Tabs */}
          <div className="flex-shrink-0 bg-[#252422] border-b border-[#4A4A4A]">
            <div className="flex overflow-x-auto">
              {[
                { id: "problem", label: "Problem", icon: <IconCode size={16} /> },
                { id: "theory", label: "Explanation", icon: <IconBook size={16} /> },
                { id: "hints", label: "Hints", icon: <IconSparkles size={16} /> },
                { id: "references", label: "References", icon: <IconExternalLink size={16} /> },
                { id: "solution", label: "Solution", icon: <IconCheck size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTheoryTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3.5 font-mono text-xs font-semibold border-b-2 transition-colors whitespace-nowrap uppercase tracking-wider ${
                    activeTheoryTab === tab.id
                      ? "border-[#FF6A2A] text-[#FF6A2A] bg-[#1B1B1B]"
                      : "border-transparent text-[#8E8E8E] hover:text-white hover:bg-[#303030]"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theory Content */}
          <div className="flex-1 overflow-y-auto p-6 font-outfit">
            {activeTheoryTab === "problem" && (
              <div className="space-y-6">
                <div className="bytecode-card p-6">
                  <h2 className="text-xl font-cinzel text-white tracking-wide mb-3 flex items-center gap-2.5">
                    <IconTarget size={20} className="text-[#FF6A2A]" />
                    <span>Challenge Description</span>
                  </h2>
                  <p className="text-[#CFCFCF] text-base leading-relaxed">
                    {exercise.description || "No description available."}
                  </p>
                </div>

                <div className="bg-[#252422] border border-[#4A4A4A] p-6">
                  <h3 className="text-lg font-bebas text-white tracking-wide mb-2 flex items-center gap-2">
                    <IconSparkles size={18} className="text-[#FF8C42]" />
                    <span>Objective</span>
                  </h3>
                  <p className="text-[#CFCFCF] text-sm font-outfit">{exercise.objective || "Complete the coding challenge."}</p>
                </div>

                {exercise.requirements && exercise.requirements.length > 0 && (
                  <div className="bg-[#252422] border border-[#4A4A4A] p-6">
                    <h3 className="text-lg font-bebas text-white tracking-wide mb-3 flex items-center gap-2">
                      <IconCheck size={18} className="text-[#35C759]" />
                      <span>Requirements</span>
                    </h3>
                    <ul className="text-[#CFCFCF] text-sm space-y-2 font-mono">
                      {exercise.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <IconChevronRight
                            size={16}
                            className="text-[#FF6A2A] mt-0.5 flex-shrink-0"
                          />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`bg-gradient-to-r ${getDifficultyColor(
                      exercise.difficulty
                    )}/20 rounded-2xl p-4 border border-gray-700`}
                  >
                    <div className="text-gray-400 flex items-center gap-2">
                      {getDifficultyIcon(exercise.difficulty)}
                      Difficulty
                    </div>
                    <div
                      className={`font-semibold text-lg bg-gradient-to-r ${getDifficultyColor(
                        exercise.difficulty
                      )} bg-clip-text text-transparent`}
                    >
                      {exercise.difficulty || "Unknown"}
                    </div>
                  </div>
                  {/* <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
                    <div className="text-gray-400 flex items-center gap-2">
                       Duration
                    </div>
                    <div className="font-semibold text-lg text-white">
                      {exercise.duration || "Not specified"}
                    </div>
                  </div> */}
                </div>
              </div>
            )}

            {activeTheoryTab === "theory" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                     Theory & Concepts
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                      {exercise.theory || "No theory content available."}
                    </p>
                  </div>
                </div>

                {exercise.codeExample && (
                  <div className="bg-[#252422] border border-[#4A4A4A] p-6">
                    <h3 className="text-lg font-bebas text-white tracking-wide mb-3 flex items-center gap-2">
                      <IconCode size={18} className="text-[#FF6A2A]" />
                      <span>Code Example</span>
                    </h3>
                    <div className="relative">
                      <pre className="bg-[#1B1B1B] p-4 text-xs font-mono border border-[#4A4A4A] overflow-x-auto text-[#CFCFCF]">
                        <code>
                          {exercise.codeExample}
                        </code>
                      </pre>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(exercise.codeExample);
                          setCopied(true);
                          toast.success("Code copied!");
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="absolute top-2 right-2 bg-[#252422] hover:bg-[#303030] p-1.5 border border-[#4A4A4A] text-white transition-colors"
                      >
                        {copied ? (
                          <IconCheck size={14} className="text-[#35C759]" />
                        ) : (
                          <IconCopy size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTheoryTab === "hints" && (
              <div className="space-y-6">
                <h2 className="text-xl font-cinzel text-white tracking-wide mb-4 flex items-center gap-2.5">
                  <IconSparkles size={20} className="text-[#FF8C42]" />
                  <span>Hints & Recommendations</span>
                </h2>
                {exercise.hints && exercise.hints.length > 0 ? (
                  <div className="space-y-4">
                    {exercise.hints.map((hint, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          setActiveHint(activeHint === index ? null : index)
                        }
                        className="bg-[#252422] border border-[#FF6A2A]/40 p-5 cursor-pointer hover:border-[#FF6A2A] transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="bg-[#FF6A2A]/20 text-[#FF6A2A] px-2.5 py-0.5 font-mono text-xs font-bold border border-[#FF6A2A]/30 flex-shrink-0">
                            Hint {index + 1}
                          </span>
                          <p className="text-[#CFCFCF] text-sm font-outfit flex-1">{hint}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#252422] border border-[#4A4A4A] p-6 text-center">
                    <IconSparkles size={32} className="mx-auto mb-2 text-[#8E8E8E]" />
                    <p className="text-sm font-mono text-[#8E8E8E]">No specific hints for this challenge.</p>
                  </div>
                )}
              </div>
            )}

            {activeTheoryTab === "references" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                   Learning Resources
                </h2>
                {exercise.references && exercise.references.length > 0 ? (
                  <div className="space-y-4">
                    {exercise.references.map((reference, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:scale-105"
                      >
                        <h3 className="text-lg font-semibold mb-2">
                          {reference.title}
                        </h3>
                        <p className="text-gray-300 mb-3">
                          {reference.description}
                        </p>
                        <a
                          href={reference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                          <IconExternalLink size={16} />
                          Explore Resource
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 text-center">
                    <p className="text-gray-400">
                      No references available for this exercise.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTheoryTab === "solution" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl p-6 border border-red-500/20">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                       Solution
                    </h2>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      {showSolution ? (
                        <IconEyeOff size={18} />
                      ) : (
                        <IconEye size={18} />
                      )}
                      {showSolution ? "Hide Solution" : "Reveal Solution"}
                    </button>
                  </div>

                  {showSolution ? (
                    <div className="space-y-4 mt-4">
                      <p className="text-gray-300">
                        Here's one way to solve this challenge:
                      </p>
                      <div className="relative">
                        <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm border border-green-500/30">
                          <code className="text-gray-300">
                            {exercise.solutionCode || "No solution code available."}
                          </code>
                        </pre>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              exercise.solutionCode || ""
                            );
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors"
                        >
                          {copied ? (
                            <IconCheck size={16} />
                          ) : (
                            <IconCopy size={16} />
                          )}
                        </button>
                      </div>
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                        <p className="text-green-300 text-sm">
                          <strong> Pro Tip:</strong> Study this solution
                          carefully and try to understand the concepts. Then
                          close it and implement your own version!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-6 text-center mt-4">
                      <IconEyeOff
                        size={48}
                        className="mx-auto mb-3 text-yellow-400"
                      />
                      <h3 className="text-lg font-semibold text-yellow-200 mb-2">
                        Solution Locked 
                      </h3>
                      <p className="text-yellow-100">
                        Try solving the challenge yourself first! The real
                        learning happens when you struggle and overcome
                        obstacles. 
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor & Output */}
        <div className="flex-1 flex flex-col min-w-[500px] overflow-hidden bg-gray-900/50 backdrop-blur-sm">
          {/* Code Editor */}
          <div className="flex-1 border-b border-gray-700">
            <div className="h-full bg-gray-900/80 flex flex-col">
              <div className="flex-shrink-0 bg-gray-800/50 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-[#FF6A2A] animate-pulse"></div>
                    <span className="text-slate-200 text-sm font-mono font-semibold">
                      challenge.{getFileExtension(exercise.language)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                    {getLanguageDisplayName(exercise.language)} • {outputMode}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyCode}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded font-medium text-white transition-colors flex items-center gap-2 text-sm"
                  >
                    {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={resetCode}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded font-medium text-white transition-colors text-sm"
                  >
                    Reset
                  </button>
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-4 py-2 rounded font-medium text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm shadow-lg hover:shadow-green-500/25"
                  >
                    {isRunning ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <IconPlayerPlay size={14} />
                    )}
                    {isRunning
                      ? "Running..."
                      : outputMode === "preview"
                      ? "Update Preview"
                      : "Run Code"}
                  </button>
                </div>
              </div>
              <textarea
                ref={codeEditorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-gray-900 text-white font-mono p-4 resize-none focus:outline-none text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 code-editor-bg"
                spellCheck="false"
                placeholder={`// Welcome to ${
                  exercise.title
                }!\\n// Write your ${getLanguageDisplayName(
                  exercise.language
                )} code here...\\n\\n`}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex-1 flex flex-col">
            <div className="flex-shrink-0 bg-gray-800/50 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                {outputMode === "preview" ? (
                  <>
                    <IconScreenShare size={18} />
                    Live Preview
                  </>
                ) : (
                  <>
                    <IconTerminal2 size={18} />
                    Console Output
                  </>
                )}
              </h3>
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                {outputMode === "preview"
                  ? "Real-time Rendering"
                  : "Execution Results"}
              </span>
            </div>

            <div className="flex-1 p-4 bg-black/30 overflow-auto">
              {outputMode === "preview" ? (
                <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
                  <iframe
                    key={iframeKey}
                    srcDoc={getPreviewSource()}
                    title="preview"
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin"
                  />
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Live Preview
                  </div>
                </div>
              ) : (
                <div className="bg-black/50 rounded-2xl p-4 h-full border border-gray-700">
                  <pre className="font-mono text-sm text-slate-200 h-full overflow-auto whitespace-pre-wrap">
                    {output ||
                      ` Run your ${getLanguageDisplayName(
                        exercise.language
                      )} code to see the output here...`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Sticky Bottom Action Bar */}
      <div className="w-full bg-[#141414]/95 backdrop-blur-md border-t border-[#2A2A2A] px-6 py-4 mt-8 sticky bottom-0 z-40">
        {/* Progress & Lesson Count Header */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-wider text-[#A0A0A0] uppercase">
              Lesson {(() => {
                const exs = course?.exercises || [];
                const idx = exs.findIndex((ex) => ex.id === exerciseId);
                return idx >= 0 ? idx + 1 : 1;
              })()} of {course?.exercises?.length || 1}
            </span>
            <span className="text-xs text-[#4A4A4A]">•</span>
            <span className="text-xs font-mono text-[#FF6A2A] font-semibold">
              {(() => {
                const exs = course?.exercises || [];
                const idx = exs.findIndex((ex) => ex.id === exerciseId);
                const total = exs.length || 1;
                return Math.round(((idx >= 0 ? idx + 1 : 1) / total) * 100);
              })()}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full md:w-64 h-2 bg-[#262626] border border-[#3A3A3A] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF6A2A] to-[#FF8853] transition-all duration-500"
              style={{
                width: `${(() => {
                  const exs = course?.exercises || [];
                  const idx = exs.findIndex((ex) => ex.id === exerciseId);
                  const total = exs.length || 1;
                  return Math.round(((idx >= 0 ? idx + 1 : 1) / total) * 100);
                })()}%`
              }}
            />
          </div>
        </div>

        {/* Centered Action Bar Buttons */}
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-4 sm:gap-6">
          {/* Previous Button */}
          <button
            onClick={goToPrevExercise}
            disabled={!prevExercise}
            className="bytecode-btn-secondary text-xs sm:text-sm px-5 py-2.5 flex items-center gap-2 uppercase tracking-wider font-mono min-w-[120px] justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#4A4A4A] transition-all"
          >
            <IconArrowLeft size={16} />
            <span>Previous</span>
          </button>

          {/* Mark as Complete Button */}
          <button
            onClick={markExerciseComplete}
            disabled={isCompleting || isExerciseCompleted()}
            className={`text-xs sm:text-sm px-6 py-2.5 flex items-center gap-2 uppercase tracking-wider font-mono font-bold min-w-[180px] justify-center transition-all duration-300 ${
              isExerciseCompleted()
                ? "bg-[#35C759]/20 text-[#35C759] border border-[#35C759] cursor-default opacity-90"
                : "bytecode-btn-primary"
            }`}
          >
            {isCompleting ? (
              <>
                <IconLoader2 size={16} className="animate-spin text-white" />
                <span>Saving...</span>
              </>
            ) : isExerciseCompleted() ? (
              <>
                <IconCheck size={16} />
                <span>Completed</span>
              </>
            ) : (
              <>
                <IconCheck size={16} />
                <span>Mark Complete</span>
              </>
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={goToNextExercise}
            className="bytecode-btn-secondary text-xs sm:text-sm px-5 py-2.5 flex items-center gap-2 uppercase tracking-wider font-mono min-w-[120px] justify-center transition-all"
          >
            <span>{nextExercise ? "Next" : "Finish"}</span>
            <IconArrowRight size={16} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thumb-gray-700::-webkit-scrollbar-thumb {
          background-color: #374151;
          border-radius: 3px;
        }

        .scrollbar-track-gray-900::-webkit-scrollbar-track {
          background-color: #111827;
        }

        .code-editor-bg {
          background: linear-gradient(
            45deg,
            #1a1a1a 25%,
            #1f1f1f 25%,
            #1f1f1f 50%,
            #1a1a1a 50%,
            #1a1a1a 75%,
            #1f1f1f 75%,
            #1f1f1f
          );
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default ExerciseDetail;