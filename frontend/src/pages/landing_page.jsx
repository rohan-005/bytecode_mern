/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Footer from '../components/Footer';
import { IconTerminal2, IconRocket, IconChevronRight, IconCode, IconCpu, IconShieldCheck, IconBooks } from "@tabler/icons-react";

const whyByteCode = [
  { title: "Interactive Execution", description: "Execute real code in browser without passive reading.", icon: <IconTerminal2 size={28} className="text-[#FF6A2A]" /> },
  { title: "Sequenced Tracks", description: "Unlock topics sequentially as skills build progressively.", icon: <IconCode size={28} className="text-[#35C759]" /> },
  { title: "Dev Leaderboards", description: "Earn XP, badges, and rank up across developer challenges.", icon: <IconCpu size={28} className="text-[#FFC300]" /> },
  { title: "Verified Syllabus", description: "Curriculum designed by active software engineering practitioners.", icon: <IconShieldCheck size={28} className="text-[#FF8C42]" /> },
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
    const timer = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#1B1B1B] text-[#FFFFFF] font-outfit grid-bg overflow-x-hidden">
      {/* Top Banner Status */}
      <div className="w-full bg-[#252422] border-b border-[#4A4A4A] py-2.5 px-8 flex items-center justify-between text-sm text-[#8E8E8E] z-20 font-jetbrains">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-[#35C759] animate-pulse"></span>
          <span className="text-[#35C759] font-mono font-bold">SYS_ONLINE</span>
          <span className="text-[#4A4A4A]">|</span>
          <span className="font-mono">BYTECODE DEV PLATFORM V2.0</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-xs">
          <span className="text-[#FF6A2A]">PRIMARY_ACCENT: #FF6A2A</span>
          <span className="text-[#CFCFCF]">WIDESCREEN_RESPONSIVE</span>
        </div>
      </div>

      {/* Main Widescreen Container */}
      <div className="w-full max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-16 py-12 z-10 flex flex-col items-center">
        {/* Logo + Hero Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center my-8"
        >
          <div className="relative mb-6">
            <img
              src={logo}
              alt="ByteCode Logo"
              className="w-28 h-28 sm:w-36 sm:h-36 object-contain filter drop-shadow-[0_0_24px_rgba(255,106,42,0.45)]"
            />
          </div>
          <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bebas text-[#FFFFFF] tracking-wider mb-2">
            BYTECODE
          </h1>
          <p className="text-xl sm:text-2xl text-[#FF8C42] font-cormorant tracking-wide mb-4">
            Master the Craft of Software Engineering Through Direct Practice
          </p>
          <div className="inline-flex items-center gap-2 bg-[#252422] border border-[#FF6A2A] px-5 py-1.5 font-pixelify">
            <IconTerminal2 size={18} className="text-[#FF6A2A]" />
            <span className="text-sm font-bold text-[#FF6A2A] uppercase tracking-widest">
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
              className="w-full space-y-24 mt-8 text-center"
            >
              {/* Hero CTA Box - Expansive Widescreen */}
              <div className="bytecode-card p-10 sm:p-16 shadow-2xl relative border border-[#4A4A4A]">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF6A2A]" />
                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-bebas text-[#FFFFFF] tracking-wide mb-6">
                  CODE. PRACTICE. MASTER.
                </h2>
                <p className="text-lg sm:text-xl text-[#CFCFCF] max-w-4xl mx-auto leading-relaxed mb-10 font-outfit">
                  Supercharge your developer skills with hands-on coding challenges, real-time code evaluation, and interactive curriculum.
                </p>
                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                  <button
                    onClick={() => navigate("/login")}
                    className="bytecode-btn-primary text-lg px-10 py-4 sm:w-auto w-full"
                  >
                    <IconTerminal2 size={22} />
                    <span>LAUNCH TERMINAL LOGIN</span>
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="bytecode-btn-secondary text-lg px-10 py-4 sm:w-auto w-full"
                  >
                    <IconRocket size={22} />
                    <span>CREATE DEV ACCOUNT</span>
                  </button>
                </div>
              </div>

              {/* Why ByteCode Grid */}
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-[#4A4A4A] pb-4">
                  <h3 className="text-3xl sm:text-4xl font-cinzel text-[#FFFFFF] tracking-wide flex items-center gap-3">
                    <span className="text-[#FF6A2A] font-mono">//</span> WHY BYTECODE?
                  </h3>
                  <span className="text-sm text-[#8E8E8E] font-mono">[PLATFORM_FEATURES]</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  {whyByteCode.map((item, i) => (
                    <div
                      key={i}
                      className="bytecode-card-hover p-8"
                    >
                      <div className="text-3xl mb-4">{item.icon}</div>
                      <h4 className="text-xl font-bold text-[#FFFFFF] mb-3 font-outfit">{item.title}</h4>
                      <p className="text-base text-[#CFCFCF] leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages & Frameworks */}
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-[#4A4A4A] pb-4">
                  <h3 className="text-3xl sm:text-4xl font-cinzel text-[#FFFFFF] tracking-wide flex items-center gap-3">
                    <span className="text-[#FF6A2A] font-mono">//</span> SUPPORTED TECH STACKS
                  </h3>
                  <span className="text-sm text-[#8E8E8E] font-mono">[STACK_MATRICES]</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                  {languages.map((item, i) => (
                    <div
                      key={i}
                      className={`p-8 ${item.bg} border ${item.border} bytecode-card-hover`}
                    >
                      <h4 className="text-4xl font-bebas text-[#FFFFFF] tracking-wide mb-3">{item.title}</h4>
                      <p className="text-base text-[#CFCFCF] font-mono">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* All-in-One Experience */}
              <div className="space-y-8 mb-16">
                <div className="flex items-center justify-between border-b border-[#4A4A4A] pb-4">
                  <h3 className="text-3xl sm:text-4xl font-cinzel text-[#FFFFFF] tracking-wide flex items-center gap-3">
                    <span className="text-[#FF6A2A] font-mono">//</span> ALL-IN-ONE DEVELOPER TOOLING
                  </h3>
                  <span className="text-sm text-[#8E8E8E] font-mono">[DEV_SUITE]</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                  {features.map((item, i) => (
                    <div
                      key={i}
                      className="bytecode-card-hover p-8"
                    >
                      <h4 className="text-lg font-bold text-[#FF6A2A] mb-3 font-jetbrains flex items-center gap-2">
                        <IconChevronRight size={20} />
                        {item.title}
                      </h4>
                      <p className="text-base text-[#CFCFCF] leading-relaxed font-outfit">{item.description}</p>
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
