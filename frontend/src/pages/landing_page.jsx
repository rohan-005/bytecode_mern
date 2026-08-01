/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Footer from '../components/Footer';
import { IconTerminal2, IconCode, IconCpu, IconRocket, IconBrandGithub, IconCheck, IconChevronRight } from "@tabler/icons-react";

const whyByteCode = [
  { title: "Interactive Execution", description: "Execute real code in browser without passive reading.", icon: "⚡" },
  { title: "Sequenced Tracks", description: "Unlock topics sequentially as skills build progressively.", icon: "🎯" },
  { title: "Dev Leaderboards", description: "Earn XP, badges, and rank up across developer challenges.", icon: "🏆" },
  { title: "Verified Syllabus", description: "Curriculum designed by active software engineering practitioners.", icon: "🛠️" },
];

const languages = [
  { title: "Frontend Stack", description: "HTML, CSS, JavaScript, React", bg: "bg-[#252422]", border: "border-[#FF6A2A]" },
  { title: "Backend Systems", description: "Node.js, Express, Python, Java", bg: "bg-[#252422]", border: "border-[#35C759]" },
  { title: "Mobile Dev", description: "React Native, Flutter", bg: "bg-[#252422]", border: "border-[#FFC300]" },
  { title: "Database Systems", description: "SQL, MongoDB, PostgreSQL", bg: "bg-[#252422]", border: "border-[#FF8C42]" },
];

const features = [
  { title: "In-Browser IDE", description: "Practice exercises and test algorithms directly in full Monaco editor environment." },
  { title: "ByteAI Companion", description: "Get real-time hints and explanations without giving solutions away." },
  { title: "Developer Den", description: "Collaborate, discuss solution approaches, and review peer code." },
  { title: "Gamified XP System", description: "Track streak counters, unlock retro badges, and build your dev profile." },
  { title: "Reference Docs", description: "Instant access to syntax cheatsheets and curated developer guides." },
  { title: "Career Pathways", description: "Structured tracks tailored for Full-Stack, Backend, and Frontend roles." },
];

const LandingPage = () => {
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-[#1B1B1B] text-[#FFFFFF] font-jetbrains grid-bg overflow-x-hidden">
      {/* Top Banner Status */}
      <div className="w-full bg-[#252422] border-b border-[#4A4A4A] py-2 px-4 flex items-center justify-between text-xs text-[#8E8E8E] z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#35C759] animate-pulse"></span>
          <span className="text-[#35C759] font-mono font-bold">SYS_ONLINE</span>
          <span className="text-[#4A4A4A]">|</span>
          <span className="font-mono">BYTECODE DEV PLATFORM V2.0</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px]">
          <span className="text-[#FF6A2A]">PRIMARY_ACCENT: #FF6A2A</span>
          <span className="text-[#CFCFCF]">STRICT_SHARP_MODE</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 z-10 flex flex-col items-center">
        {/* Logo + Hero Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center my-6"
        >
          <div className="relative mb-4">
            <img
              src={logo}
              alt="ByteCode Logo"
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain filter drop-shadow-[0_0_20px_rgba(255,106,42,0.4)]"
            />
          </div>
          <h1 className="text-6xl sm:text-8xl font-bebas text-[#FFFFFF] tracking-wider mb-2">
            BYTECODE
          </h1>
          <div className="inline-flex items-center gap-2 bg-[#252422] border border-[#FF6A2A] px-4 py-1">
            <IconTerminal2 size={16} className="text-[#FF6A2A]" />
            <span className="text-xs font-mono font-bold text-[#FF6A2A] uppercase tracking-widest">
              NEXT-GEN DEVELOPER LEARNING PLATFORM
            </span>
          </div>
        </motion.div>

        {/* Hero Actions */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full space-y-16 mt-6 text-center"
            >
              {/* Hero CTA Box */}
              <div className="bg-[#303030] border border-[#4A4A4A] p-8 sm:p-12 shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF6A2A]" />
                <h2 className="text-4xl sm:text-6xl font-bebas text-[#FFFFFF] tracking-wide mb-4">
                  CODE. PRACTICE. MASTER.
                </h2>
                <p className="text-sm sm:text-base text-[#CFCFCF] max-w-2xl mx-auto leading-relaxed mb-8 font-mono">
                  Supercharge your developer skills with hands-on coding challenges, real-time code evaluation, and structured curriculum.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => navigate("/login")}
                    className="bytecode-btn-primary text-sm px-8 py-3.5 sm:w-auto w-full"
                  >
                    <IconTerminal2 size={18} />
                    <span>LAUNCH TERMINAL LOGIN</span>
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="bytecode-btn-secondary text-sm px-8 py-3.5 sm:w-auto w-full"
                  >
                    <IconRocket size={18} />
                    <span>CREATE DEV ACCOUNT</span>
                  </button>
                </div>
              </div>

              {/* Why ByteCode Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#4A4A4A] pb-3">
                  <h3 className="text-2xl font-bebas text-[#FFFFFF] tracking-wide flex items-center gap-2">
                    <span className="text-[#FF6A2A]">//</span> WHY BYTECODE?
                  </h3>
                  <span className="text-xs text-[#8E8E8E] font-mono">[PLATFORM_FEATURES]</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                  {whyByteCode.map((item, i) => (
                    <div
                      key={i}
                      className="bytecode-card-hover p-5"
                    >
                      <div className="text-2xl mb-3">{item.icon}</div>
                      <h4 className="text-base font-bold text-[#FFFFFF] mb-2 font-mono">{item.title}</h4>
                      <p className="text-xs text-[#CFCFCF] leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages & Frameworks */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#4A4A4A] pb-3">
                  <h3 className="text-2xl font-bebas text-[#FFFFFF] tracking-wide flex items-center gap-2">
                    <span className="text-[#FF6A2A]">//</span> SUPPORTED TECH STACKS
                  </h3>
                  <span className="text-xs text-[#8E8E8E] font-mono">[STACK_MATRICES]</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {languages.map((item, i) => (
                    <div
                      key={i}
                      className={`p-6 ${item.bg} border ${item.border} bytecode-card-hover`}
                    >
                      <h4 className="text-2xl font-bebas text-[#FFFFFF] tracking-wide mb-2">{item.title}</h4>
                      <p className="text-xs text-[#CFCFCF] font-mono">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* All-in-One Experience */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#4A4A4A] pb-3">
                  <h3 className="text-2xl font-bebas text-[#FFFFFF] tracking-wide flex items-center gap-2">
                    <span className="text-[#FF6A2A]">//</span> ALL-IN-ONE DEVELOPER TOOLING
                  </h3>
                  <span className="text-xs text-[#8E8E8E] font-mono">[DEV_SUITE]</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                  {features.map((item, i) => (
                    <div
                      key={i}
                      className="bytecode-card-hover p-6"
                    >
                      <h4 className="text-sm font-bold text-[#FF6A2A] mb-2 font-mono flex items-center gap-2">
                        <IconChevronRight size={16} />
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#CFCFCF] leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
