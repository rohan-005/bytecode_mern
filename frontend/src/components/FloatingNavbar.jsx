/**
 * FloatingNavbar.jsx
 * Premium sharp developer-platform floating navbar.
 * Raycast / VS Code inspired dock with terminal aesthetics.
 * Features bottom active indicator bar.
 */

import React, { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "../lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";

export const FloatingNavbar = ({ items, className }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mouseX = useMotionValue(Infinity);
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <div
      className={cn(
        "fixed top-1 right-8 md:right-8 flex items-center justify-center z-50 font-jetbrains",
        className
      )}
    >
      {/* Desktop Floating Dock */}
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="hidden md:flex gap-4 px-4 py-3 bg-[#2F3437]/92 backdrop-blur-xl border border-[#626A6E]/70 shadow-xl shadow-black/40"
      >
        {items.map((item) => (
          <IconButton 
            key={item.title} 
            {...item} 
            mouseX={mouseX} 
            isActive={currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))}
          />
        ))}
      </motion.div>

      {/* Mobile Navbar */}
      <div className="relative flex md:hidden">
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-16 right-0 flex flex-col gap-2 p-3 bg-[#2F3437] border border-[#626A6E] shadow-2xl min-w-[180px]"
            >
              {items.map((item) => {
                const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href));
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 bg-[#3A4044] hover:bg-[#454C50] border transition-colors relative ${
                      isActive ? "border-[#66BB6A] text-white" : "border-[#626A6E] text-[#D5DBD6]"
                    }`}
                  >
                    <span className={isActive ? "text-[#66BB6A]" : "text-[#AAB2AD]"}>{item.icon}</span>
                    <span className="text-sm font-semibold uppercase tracking-wider font-jetbrains">
                      {item.title}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#66BB6A]" />
                    )}
                  </a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-12 w-12 items-center justify-center bg-[#2F3437] border border-[#626A6E] text-white hover:border-[#66BB6A] hover:text-[#66BB6A] transition-all shadow-lg active:scale-95"
          aria-label="Toggle menu"
        >
          <IconLayoutNavbarCollapse size={22} />
        </button>
      </div>
    </div>
  );
};

const IconButton = ({ icon, title, href, mouseX, isActive }) => {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const size = useTransform(distance, [-100, 0, 100], [48, 62, 48]);
  const iconSize = useTransform(distance, [-100, 0, 100], [22, 28, 22]);

  const springSize = useSpring(size, { stiffness: 450, damping: 22 });
  const springIcon = useSpring(iconSize, { stiffness: 450, damping: 22 });

  return (
    <motion.a href={href} ref={ref} className="relative select-none group">
      <motion.div
        style={{ width: springSize, height: springSize }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`flex items-center justify-center bg-[#3A4044] border transition-all relative ${
          isActive 
            ? "border-[#66BB6A] text-[#F5F7F5] bg-[#454C50]" 
            : "border-[#626A6E] text-[#D5DBD6] group-hover:border-[#66BB6A] group-hover:text-[#66BB6A] group-hover:bg-[#454C50]"
        }`}
      >
        <motion.div
          style={{ width: springIcon, height: springIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>

        {/* Bottom Active Indicator Underline */}
        {(isActive || hovered) && (
          <motion.div 
            layoutId="navbar-active-indicator"
            className="absolute bottom-0 left-1 right-1 h-1 bg-[#66BB6A]" 
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          />
        )}

        {/* Sharp Tooltip Above */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 6, x: "-50%" }}
              transition={{ duration: 0.1 }}
              className="absolute top-12 left-1/2 px-3 py-1 bg-[#454C50] text-xs font-semibold text-[#F5F7F5] border border-[#66BB6A] uppercase tracking-wider whitespace-nowrap shadow-xl z-50 pointer-events-none"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.a>
  );
};
