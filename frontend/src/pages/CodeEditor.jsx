/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { FloatingNavbar } from "../components/FloatingNavbar";
import {
  IconHome,
  IconBooks,
  IconCode,
  IconCpu,
  IconEdit,
  IconX,
  IconPlus,
  IconAlertTriangle,
  IconDownload,
} from "@tabler/icons-react";
import logo from "../assets/logo.png"

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: <IconHome size={20} /> },
  { title: "Courses", href: "/courses", icon: <IconBooks size={20} /> },
  { title: "Byte-Compiler", href: "/editor", icon: <IconEdit size={20} /> },
  { title: "Dev Den", href: "/code", icon: <IconCode size={20} /> },
  { title: "AI", href: "/byteai", icon: <IconCpu size={20} /> },
];


// Default code templates for different languages
const defaultCode = {
  javascript: `// Welcome to ByteCode JavaScript Editor
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci Sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}

// Array operations
const numbers = [1, 2, 3, 4, 5];
const squares = numbers.map(n => n * n);
console.log("Squares:", squares);`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ByteCode Playground</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 40px;
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .feature {
            background: rgba(255, 255, 255, 0.2);
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to ByteCode!</h1>
        <div class="feature">
            <h3>✨ Code Editor</h3>
            <p>Write and test your HTML, CSS, and JavaScript code in real-time.</p>
        </div>
        <div class="feature">
            <h3>🎯 Live Preview</h3>
            <p>See your changes instantly with our live preview feature.</p>
        </div>
        <div class="feature">
            <h3>💾 Save & Load</h3>
            <p>Save your code snippets and load them anytime.</p>
        </div>
    </div>
</body>
</html>`,

  css: `/* ByteCode CSS Playground */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.container {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  text-align: center;
}

.title {
  font-size: 3em;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
}

.subtitle {
  color: #666;
  font-size: 1.2em;
  margin-bottom: 30px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 30px;
}

.feature {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
}`,

  python: `# ByteCode Python Playground
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)

print("Python Code Executed Successfully!")
print("Fibonacci of 5:", fibonacci(5))
print("Factorial of 5:", factorial(5))`,

  cpp: `// ByteCode C++ Playground
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

long long factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}

int main() {
    cout << "C++ Code Executed Successfully!" << endl;
    cout << "Fibonacci of 5: " << fibonacci(5) << endl;
    cout << "Factorial of 5: " << factorial(5) << endl;
    return 0;
}`
};

export default function CodeEditor() {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      name: "script.js",
      language: "javascript",
      code: defaultCode.javascript,
      output: "",
      activeView: "output",
      isDirty: false
    }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextTabId, setNextTabId] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const iframeRefs = useRef({});
  const editorRef = useRef(null);

  const API_BASE = import.meta.env.REACT_APP_API_URL || "https://bytecode-qsew.onrender.com/api";
  // course
  // Add this function to CodeEditor.jsx
const initializeExerciseMode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const exerciseId = urlParams.get('exercise');
  const courseId = urlParams.get('course');
  
  if (exerciseId && courseId && window.history.state?.exercise) {
    const exercise = window.history.state.exercise;
    setTabs([{
      id: 1,
      name: `exercise-${exerciseId}.js`,
      language: "javascript",
      code: exercise.initialCode || '',
      targetCode: exercise.targetCode,
      output: "",
      activeView: "output",
      isDirty: false,
      exerciseMode: true,
      exerciseData: exercise
    }]);
  }
};

// Call this in useEffect
useEffect(() => {
  initializeExerciseMode();
}, []);
  // Show disclaimer on first load
  useEffect(() => {
    const disclaimerSeen = localStorage.getItem('bytecode-disclaimer-seen');
    if (disclaimerSeen) {
      setShowDisclaimer(false);
    }
  }, []);

  // Get current active tab
  const getActiveTab = () => tabs.find(tab => tab.id === activeTabId);

  // Update tab data
  const updateTab = (tabId, updates) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    ));
  };

  // Add notification
  const addNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 3000);
  };

  // Editor mount handler
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    monaco.editor.defineTheme('bytecode-elegant', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: '06b6d4' },
        { token: 'string', foreground: '14b8a6' },
        { token: 'number', foreground: 'f59e0b' },
      ],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#1a1a1a',
        'editor.selectionBackground': '#334155',
        'editor.inactiveSelectionBackground': '#1a1a1a',
      }
    });
    monaco.editor.setTheme('bytecode-elegant');
  };

  // Add new tab
  const addNewTab = (language = "javascript") => {
    const newTab = {
      id: nextTabId,
      name: `${getDefaultFileName(language)}.${getFileExtension(language)}`,
      language,
      code: defaultCode[language] || defaultCode.javascript,
      output: "",
      activeView: "output",
      isDirty: false
    };
    
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(nextTabId);
    setNextTabId(prev => prev + 1);
    addNotification(`New ${language} tab created`, "success");
  };

  // Close tab
  const closeTab = (tabId, e) => {
    e.stopPropagation();
    
    if (tabs.length === 1) {
      addNotification("Cannot close the last tab", "error");
      return;
    }

    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    setTabs(newTabs);
    
    // If closing active tab, activate another tab
    if (tabId === activeTabId) {
      if (tabIndex >= newTabs.length) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      } else {
        setActiveTabId(newTabs[tabIndex].id);
      }
    }
    
    // Clean up iframe ref
    delete iframeRefs.current[tabId];
    
    addNotification("Tab closed", "info");
  };

  // Get or create iframe ref for tab
  const getIframeRef = (tabId) => {
    if (!iframeRefs.current[tabId]) {
      iframeRefs.current[tabId] = React.createRef();
    }
    return iframeRefs.current[tabId];
  };

  // Download code as file
  const downloadCode = () => {
    const activeTab = getActiveTab();
    if (!activeTab) return;

    const extension = getFileExtension(activeTab.language);
    const filename = activeTab.name || `bytecode.${extension}`;
    const blob = new Blob([activeTab.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addNotification(`Code downloaded as ${filename}`, "success");
  };

  // Download all tabs as zip
  const downloadAllTabs = () => {
    if (tabs.length === 0) return;

    // For single tab, just download that file
    if (tabs.length === 1) {
      downloadCode();
      return;
    }

    // For multiple tabs, create a zip file
    const zip = new zip();
    
    tabs.forEach((tab, index) => {
      const extension = getFileExtension(tab.language);
      const filename = tab.name || `code_${index + 1}.${extension}`;
      zip.file(filename, tab.code);
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bytecode-tabs.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addNotification(`All ${tabs.length} tabs downloaded as ZIP`, "success");
    });
  };

  // Mock execution for server-side languages
  const mockServerExecution = (lang, code) => {
    const lines = code.split('\n').filter(line => line.trim().length > 0);
    const functions = lines.filter(line => 
      line.includes('def ') || line.includes('function') || 
      line.includes('public static') || line.includes('int ') || 
      line.includes('void ') || line.includes('class ')
    );
    
    let mockOutput = `🔧 ${lang.toUpperCase()} Code Analysis (Mock Execution)\n`;
    mockOutput += "=".repeat(40) + "\n\n";
    mockOutput += `📊 Code Statistics:\n`;
    mockOutput += `   • Lines of code: ${lines.length}\n`;
    mockOutput += `   • Functions/Classes found: ${functions.length}\n\n`;
    
    if (functions.length > 0) {
      mockOutput += `📝 Detected Functions/Classes:\n`;
      functions.slice(0, 5).forEach((func, index) => {
        mockOutput += `   ${index + 1}. ${func.trim().substring(0, 50)}${func.trim().length > 50 ? '...' : ''}\n`;
      });
    }
    
    mockOutput += `\n💡 Note: To execute ${lang.toUpperCase()} code, you need:\n`;
    mockOutput += `   • A backend server with ${lang.toUpperCase()} runtime\n`;
    mockOutput += `   • Proper compilation environment\n`;
    mockOutput += `   • Security measures for code execution\n\n`;
    mockOutput += `🚀 Try JavaScript for immediate browser execution!`;
    
    return mockOutput;
  };

  // Run Code based on language
  const runCode = async () => {
    const activeTab = getActiveTab();
    if (!activeTab) return;

    setIsRunning(true);
    updateTab(activeTabId, { output: "Running..." });

    try {
      switch (activeTab.language) {
        case "javascript":
          await runJavaScript(activeTab);
          break;
        case "html":
        case "css":
          runHTMLCSS(activeTab);
          break;
        case "python":
        case "cpp":
          await runServerCode(activeTab);
          break;
        default:
          updateTab(activeTabId, { output: `Language "${activeTab.language}" not supported for execution` });
      }
    } catch (error) {
      updateTab(activeTabId, { output: `Error: ${error.message}` });
    } finally {
      setIsRunning(false);
    }
  };

  // Run JavaScript in browser
  const runJavaScript = (tab) => {
    const logs = [];
    const errors = [];

    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    // Capture console output
    console.log = (...args) => logs.push(`📝 ${args.join(' ')}`);
    console.error = (...args) => errors.push(`❌ ${args.join(' ')}`);
    console.warn = (...args) => logs.push(`⚠️ ${args.join(' ')}`);
    console.info = (...args) => logs.push(`ℹ️ ${args.join(' ')}`);

    try {
      // Use Function constructor to safely run isolated code
      const result = new Function(tab.code)();
      if (result !== undefined) {
        logs.push(`🎯 Return: ${result}`);
      }
      
      const allOutput = [...logs, ...errors].join('\n');
      updateTab(tab.id, { 
        output: allOutput || "Code executed successfully (no output)",
        activeView: "console"
      });
    } catch (err) {
      updateTab(tab.id, { 
        output: `❌ Error: ${err.toString()}`,
        activeView: "console"
      });
    } finally {
      // Restore original console methods
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
    }

    // Display in iframe for this specific tab
    const iframe = getIframeRef(tab.id).current;
    if (iframe) {
      iframe.srcdoc = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                background: #000000; 
                color: #e2e8f0; 
                font-family: 'JetBrains Mono', monospace; 
                padding: 20px;
                margin: 0;
                line-height: 1.6;
              }
              .log { color: #10b981; }
              .error { color: #ef4444; }
              .warn { color: #f59e0b; }
            </style>
          </head>
          <body>
            <pre>${logs.join('\n') || "No output"}</pre>
          </body>
        </html>
      `;
    }
  };

  // Run HTML/CSS in iframe
  const runHTMLCSS = (tab) => {
    const iframe = getIframeRef(tab.id).current;
    if (iframe) {
      if (tab.language === "html") {
        iframe.srcdoc = tab.code;
      } else if (tab.language === "css") {
        iframe.srcdoc = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>${tab.code}</style>
            </head>
            <body>
              <div class="container">
                <h1>CSS Preview</h1>
                <p>Your CSS styles are applied to this page.</p>
                <div class="feature-grid">
                  <div class="feature">Feature 1</div>
                  <div class="feature">Feature 2</div>
                  <div class="feature">Feature 3</div>
                </div>
              </div>
            </body>
          </html>
        `;
      }
    }
    
    updateTab(tab.id, { 
      output: "Rendered in preview tab",
      activeView: "output"
    });
  };

  // Run server-side code (Python, Java, C++)
  const runServerCode = async (tab) => {
    try {
      const res = await axios.post(`${API_BASE}/code/execute`, {
        language: tab.language,
        code: tab.code
      }, {
        timeout: 5000
      });
      
      updateTab(tab.id, { 
        output: res.data.output || "Code executed successfully",
        activeView: "console"
      });
    } catch (err) {
      const mockOutput = mockServerExecution(tab.language, tab.code);
      updateTab(tab.id, { 
        output: mockOutput,
        activeView: "console"
      });
    }
  };

  // Format code
  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
      addNotification("Code formatted", "success");
    }
  };

  // Clear console
  const clearConsole = () => {
    updateTab(activeTabId, { output: "" });
    const iframe = getIframeRef(activeTabId).current;
    if (iframe) {
      iframe.srcdoc = "";
    }
    addNotification("Console cleared", "info");
  };

  // Reset to default template
  const resetCode = () => {
    const activeTab = getActiveTab();
    if (!activeTab) return;

    updateTab(activeTabId, { 
      code: defaultCode[activeTab.language] || defaultCode.javascript 
    });
    addNotification("Code reset to template", "info");
  };

  // Handle code change
  const handleCodeChange = (value) => {
    updateTab(activeTabId, { 
      code: value,
      isDirty: value !== defaultCode[getActiveTab()?.language]
    });
  };

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    const activeTab = getActiveTab();
    if (!activeTab) return;

    updateTab(activeTabId, { 
      language: newLanguage,
      code: defaultCode[newLanguage] || defaultCode.javascript,
      name: `${getDefaultFileName(newLanguage)}.${getFileExtension(newLanguage)}`,
      output: "",
      isDirty: false
    });
  };

  // Handle tab view change (output/console)
  const handleTabViewChange = (view) => {
    updateTab(activeTabId, { activeView: view });
  };

  // Handle disclaimer close
  const handleDisclaimerClose = () => {
    setShowDisclaimer(false);
    localStorage.setItem('bytecode-disclaimer-seen', 'true');
  };

  return (
    <div className="flex flex-col h-screen bg-black text-slate-100 overflow-hidden">
      {/* Floating Navbar */}
      <FloatingNavbar items={navItems} />

      {/* Disclaimer Banner */}
      

      {/* Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`px-4 py-3 rounded-lg border-l-4 shadow-lg backdrop-blur-sm ${
              notif.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-400 text-emerald-100'
                : notif.type === 'error'
                ? 'bg-rose-500/10 border-rose-400 text-rose-100'
                : 'bg-slate-500/10 border-slate-400 text-slate-100'
            }`}
          >
            {notif.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-800 bg-black mt-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="ByteCode Logo" className="w-15 h-15" />
            <h1 className="text-blue-400 text-5xl font-semibold bg-gradient-to-r from-slate-100 to-purple-200 bg-clip-text font-transformer">
              Byte Compiler
            </h1>
          </div>

          {/* Centered Controls */}
          <div className="flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
            <select
              value={getActiveTab()?.language || "javascript"}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-gray-800 text-slate-100 px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-cyan-500 text-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>

            <button
              onClick={runCode}
              disabled={isLoading || isRunning}
              className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {isRunning ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "▶"
              )}
              Run
            </button>

            <button
              onClick={formatCode}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded font-medium text-white transition-colors text-sm"
            >
              Format
            </button>

            <button
              onClick={resetCode}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded font-medium text-white transition-colors text-sm"
            >
              Reset
            </button>

            <button
              onClick={clearConsole}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded font-medium text-white transition-colors text-sm"
            >
              Clear
            </button>

            {/* Download Button */}
            <button
              onClick={downloadCode}
              className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded font-medium text-white transition-colors text-sm flex items-center gap-2"
            >
              <IconDownload size={16} />
              Download
            </button>
          </div>
        </div>
      </div>
      {showDisclaimer && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconAlertTriangle size={20} className="text-amber-400" />
              <div className="text-sm">
                <strong className="text-amber-200">Warning:</strong> 
                <span className="text-amber-100 ml-2">
                  Your work will be lost if you reload or leave this page. 
                  For permanent storage and better performance, use a local development environment.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadAllTabs}
                className="bg-amber-600 hover:bg-amber-500 px-3 py-1 rounded text-xs font-medium text-white transition-colors flex items-center gap-1"
              >
                <IconDownload size={14} />
                Download All
              </button>
              <button
                onClick={handleDisclaimerClose}
                className="text-amber-200 hover:text-amber-100 text-xs font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Browser-style Tab Bar */}
      <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center">
          {/* New Tab Button */}
          <button
            onClick={() => addNewTab(getActiveTab()?.language || "javascript")}
            className="px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-gray-800 transition-colors border-r border-gray-800"
          >
            <IconPlus size={16} />
          </button>

          {/* Tabs */}
          <div className="flex items-center overflow-x-auto flex-1">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 border-r border-gray-800 transition-colors cursor-pointer group min-w-0 max-w-xs ${
                  tab.id === activeTabId
                    ? 'bg-gray-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-gray-800/50'
                }`}
              >
                {/* File Icon */}
                <div className="w-4 h-4 flex items-center justify-center">
                  {getFileIcon(tab.language)}
                </div>
                
                {/* Tab Name */}
                <span className="truncate text-sm flex-1">
                  {tab.name}
                  {tab.isDirty && <span className="ml-1">•</span>}
                </span>

                {/* Close Button */}
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded p-1 transition-all"
                >
                  <IconX size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Tab Counter */}
          <div className="px-3 py-2 text-slate-500 text-xs border-l border-gray-800">
            {tabs.length} {tabs.length === 1 ? 'tab' : 'tabs'}
          </div>
        </div>
      </div>

      {/* Persistent Warning for Unsaved Work */}
      {tabs.some(tab => tab.isDirty) && (
        <div className="bg-rose-500/10 border-b border-rose-500/20 px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-xs text-rose-200">
            <IconAlertTriangle size={14} />
            <span>You have unsaved work. Download your code to prevent data loss.</span>
            <button
              onClick={downloadAllTabs}
              className="bg-rose-600 hover:bg-rose-500 px-2 py-1 rounded text-xs font-medium text-white transition-colors flex items-center gap-1 ml-2"
            >
              <IconDownload size={12} />
              Save All
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Section */}
        <div className="flex-1 flex flex-col border-r border-gray-800">
          <div className="flex-shrink-0 bg-black/40 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span className="text-slate-400 text-sm font-mono">
                  {getActiveTab()?.name || "script.js"}
                </span>
                {getActiveTab()?.isDirty && (
                  <span className="text-amber-400 text-xs">• Modified</span>
                )}
              </div>
              <div className="text-slate-500 text-xs">
                {getLanguageStatus(getActiveTab()?.language)}
              </div>
            </div>
            <div className="text-slate-500 text-xs">
              {getActiveTab()?.code.split('\n').length} lines • {getActiveTab()?.code.length} chars
            </div>
          </div>
          <div className="flex-1">
            <Editor
              key={activeTabId} // Force re-render when tab changes
              height="100%"
              language={getActiveTab()?.language}
              theme="bytecode-elegant"
              value={getActiveTab()?.code}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 16,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                glyphMargin: false,
                folding: false,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                renderLineHighlight: "all",
                selectionHighlight: false,
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
                scrollbar: {
                  vertical: "hidden",
                  horizontal: "hidden",
                  useShadows: false
                },
                padding: { top: 16, bottom: 16 },
                lineHeight: 1.5,
                wordWrap: "on",
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                formatOnType: true,
                formatOnPaste: true,
              }}
            />
          </div>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex-shrink-0 bg-black/40 px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleTabViewChange("output")}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                  getActiveTab()?.activeView === "output" 
                    ? "bg-gray-800 text-slate-100" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>👁️</span> Preview
              </button>
              <button
                onClick={() => handleTabViewChange("console")}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                  getActiveTab()?.activeView === "console" 
                    ? "bg-gray-800 text-slate-100" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>📟</span> Console
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-black/20">
            {getActiveTab()?.activeView === "output" && (
              <iframe
                ref={getIframeRef(activeTabId)}
                key={`iframe-${activeTabId}`} // Force re-render when tab changes
                title="output"
                sandbox="allow-scripts allow-same-origin"
                className="w-full h-full bg-white"
              />
            )}
            
            {getActiveTab()?.activeView === "console" && (
              <div className="h-full p-4">
                <pre className="font-mono text-sm text-slate-200 h-full overflow-auto whitespace-pre-wrap bg-black/50 p-4 rounded-lg">
                  {getActiveTab()?.output || `// ${getConsoleMessage(getActiveTab()?.language)}\n// Run your code to see the output!`}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getFileExtension(lang) {
  const extensions = {
    javascript: 'js',
    html: 'html',
    css: 'css',
    python: 'py',
    java: 'java',
    cpp: 'cpp'
  };
  return extensions[lang] || 'txt';
}

function getDefaultFileName(lang) {
  const names = {
    javascript: 'script',
    html: 'index',
    css: 'styles',
    python: 'main',
    java: 'Main',
    cpp: 'main'
  };
  return names[lang] || 'code';
}

function getFileIcon(lang) {
  const icons = {
    javascript: '🟨',
    html: '🌐',
    css: '🎨',
    python: '🐍',
    java: '☕',
    cpp: '⚙️'
  };
  return icons[lang] || '📄';
}

function getLanguageStatus(lang) {
  const status = {
    javascript: '🟢 Browser Execution',
    html: '🟢 Live Preview',
    css: '🟢 Live Preview', 
    python: '🟡 Mock Execution',
    java: '🟡 Mock Execution',
    cpp: '🟡 Mock Execution'
  };
  return status[lang] || '⚪ Unknown';
}

function getConsoleMessage(lang) {
  const messages = {
    javascript: 'JavaScript code runs directly in your browser',
    html: 'HTML renders in the preview tab',
    css: 'CSS styles render in the preview tab',
    python: 'Python code analysis (mock execution)',
    java: 'Java code analysis (mock execution)',
    cpp: 'C++ code analysis (mock execution)'
  };
  return messages[lang] || 'Ready to code!';
}