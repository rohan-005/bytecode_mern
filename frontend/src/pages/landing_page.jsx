/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Footer from '../components/Footer';
import { IconTerminal2, IconRocket, IconChevronRight, IconCode, IconCpu, IconShieldCheck, IconBooks } from "@tabler/icons-react";

const whyByteCode = [
  { title: "Interactive Execution", description: "Execute real code in browser without passive reading.", icon: <IconTerminal2 size={28} className="text-[#66BB6A]" /> },
  { title: "Sequenced Tracks", description: "Unlock topics sequentially as skills build progressively.", icon: <IconCode size={28} className="text-[#66BB6A]" /> },
  { title: "Dev Leaderboards", description: "Earn XP, badges, and rank up across developer challenges.", icon: <IconCpu size={28} className="text-[#FBC02D]" /> },
  { title: "Verified Syllabus", description: "Curriculum designed by active software engineering practitioners.", icon: <IconShieldCheck size={28} className="text-[#A5D6A7]" /> },
];

const languages = [
  { title: "Frontend Stack", description: "HTML, CSS, JavaScript, React", bg: "bg-[#2F3437]", border: "border-[#66BB6A]" },
  { title: "Backend Systems", description: "Node.js, Express, Python, Java", bg: "bg-[#2F3437]", border: "border-[#66BB6A]" },
  { title: "Mobile Dev", description: "React Native, Flutter", bg: "bg-[#2F3437]", border: "border-[#FBC02D]" },
  { title: "Database Systems", description: "SQL, MongoDB, PostgreSQL", bg: "bg-[#2F3437]", border: "border-[#A5D6A7]" },
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
    <div className="relative min-h-screen flex flex-col justify-between bg-[#2F3437] text-[#F5F7F5] font-outfit grid-bg overflow-x-hidden">
      {/* Top Banner Status */}
      <div className="w-full bg-[#2F3437] border-b border-[#626A6E] py-2.5 px-8 flex items-center justify-between text-sm text-[#AAB2AD] z-20 font-jetbrains">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-[#66BB6A] animate-pulse"></span>
          <span className="text-[#66BB6A] font-mono font-bold">SYS_ONLINE</span>
          <span className="text-[#626A6E]">|</span>
          <span className="font-mono">BYTECODE DEV PLATFORM V2.0</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-xs">
          <span className="text-[#66BB6A]">PRIMARY_ACCENT: #66BB6A</span>
          <span className="text-[#D5DBD6]">WIDESCREEN_RESPONSIVE</span>
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
              className="w-28 h-28 sm:w-36 sm:h-36 object-contain filter drop-shadow-[0_0_24px_rgba(102,187,106,0.3)]"
            />
          </div>
          <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bebas text-[#F5F7F5] tracking-wider mb-2">
            BYTECODE
          </h1>
          <p className="text-xl sm:text-2xl text-[#A5D6A7] font-cormorant tracking-wide mb-4">
            Master the Craft of Software Engineering Through Direct Practice
          </p>
          <div className="inline-flex items-center gap-2 bg-[#2F3437] border border-[#66BB6A] px-5 py-1.5 font-pixelify">
            <IconTerminal2 size={18} className="text-[#66BB6A]" />
            <span className="text-sm font-bold text-[#66BB6A] uppercase tracking-widest">
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
              <div className="bytecode-card p-10 sm:p-16 shadow-2xl relative border border-[#626A6E]">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#66BB6A]" />
                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-bebas text-[#F5F7F5] tracking-wide mb-6">
                  CODE. PRACTICE. MASTER.
                </h2>
                <p className="text-lg sm:text-xl text-[#D5DBD6] max-w-4xl mx-auto leading-relaxed mb-10 font-outfit">
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
                <div className="flex items-center justify-between border-b border-[#626A6E] pb-4">
                  <h3 className="text-3xl sm:text-4xl font-cinzel text-[#F5F7F5] tracking-wide flex items-center gap-3">
                    <span className="text-[#66BB6A] font-mono">//</span> WHY BYTECODE?
                  </h3>
                  <span className="text-sm text-[#AAB2AD] font-mono">[PLATFORM_FEATURES]</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  {whyByteCode.map((item, i) => (
                    <div
                      key={i}
                      className="bytecode-card-hover p-8"
                    >
                      <div className="text-3xl mb-4">{item.icon}</div>
                      <h4 className="text-xl font-bold text-[#F5F7F5] mb-3 font-outfit">{item.title}</h4>
                      <p className="text-base text-[#D5DBD6] leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages & Frameworks */}
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-[#626A6E] pb-4">
                  <h3 className="text-3xl sm:text-4xl font-cinzel text-[#F5F7F5] tracking-wide flex items-center gap-3">
                    <span className="text-[#66BB6A] font-mono">//</span> SUPPORTED TECH STACKS
                  </h3>
                  <span className="text-sm text-[#AAB2AD] font-mono">[STACK_MATRICES]</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                  {languages.map((item, i) => (
                    <div
                      key={i}
                      className={`p-8 ${item.bg} border ${item.border} bytecode-card-hover`}
                    >
                      <h4 className="text-4xl font-bebas text-[#F5F7F5] tracking-wide mb-3">{item.title}</h4>
                      <p className="text-base text-[#D5DBD6] font-mono">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* All-in-One Experience */}
              <div className="space-y-8 mb-16">
                <div className="flex items-center justify-between border-b border-[#626A6E] pb-4">
                  <h3 className="text-3xl sm:text-4xl font-cinzel text-[#F5F7F5] tracking-wide flex items-center gap-3">
                    <span className="text-[#66BB6A] font-mono">//</span> ALL-IN-ONE DEVELOPER TOOLING
                  </h3>
                  <span className="text-sm text-[#AAB2AD] font-mono">[DEV_SUITE]</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                  {features.map((item, i) => (
                    <div
                      key={i}
                      className="bytecode-card-hover p-8"
                    >
                      <h4 className="text-lg font-bold text-[#66BB6A] mb-3 font-jetbrains flex items-center gap-2">
                        <IconChevronRight size={20} />
                        {item.title}
                      </h4>
                      <p className="text-base text-[#D5DBD6] leading-relaxed font-outfit">{item.description}</p>
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
