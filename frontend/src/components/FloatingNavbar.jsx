/**
 * FloatingNavbar.jsx
 * Premium sharp developer-platform floating navbar.
 * Raycast / VS Code inspired dock with terminal aesthetics.
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

  return (
    <div
      className={cn(
        "fixed top-6 right-8 md:right-12 flex items-center justify-center z-50 font-jetbrains",
        className
      )}
    >
      {/* Desktop Floating Dock */}
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="hidden md:flex gap-4 px-4 py-3 bg-[#1B1B1B]/95 backdrop-blur-md border border-[#4A4A4A] shadow-2xl shadow-black/90"
      >
        {items.map((item) => (
          <IconButton key={item.title} {...item} mouseX={mouseX} />
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
              className="absolute top-16 right-0 flex flex-col gap-2 p-3 bg-[#1B1B1B] border border-[#4A4A4A] shadow-2xl min-w-[180px]"
            >
              {items.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 bg-[#2D2D2D] hover:bg-[#303030] border border-[#4A4A4A] text-white hover:text-[#FF6A2A] transition-colors"
                >
                  <span className="text-[#FF6A2A]">{item.icon}</span>
                  <span className="text-sm font-semibold uppercase tracking-wider font-jetbrains">
                    {item.title}
                  </span>
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-12 w-12 items-center justify-center bg-[#1B1B1B] border border-[#4A4A4A] text-white hover:border-[#FF6A2A] hover:text-[#FF6A2A] transition-all shadow-lg active:scale-95"
          aria-label="Toggle menu"
        >
          <IconLayoutNavbarCollapse size={22} />
        </button>
      </div>
    </div>
  );
};

const IconButton = ({ icon, title, href, mouseX }) => {
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
        className="flex items-center justify-center bg-[#2D2D2D] border border-[#4A4A4A] text-[#CFCFCF] group-hover:border-[#FF6A2A] group-hover:text-[#FF6A2A] group-hover:bg-[#303030] transition-colors"
      >
        <motion.div
          style={{ width: springIcon, height: springIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>

        {/* Sharp Tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 8, x: "-50%" }}
              transition={{ duration: 0.1 }}
              className="absolute -top-11 left-1/2 px-3 py-1 bg-[#303030] text-xs font-semibold text-[#FFFFFF] border border-[#FF6A2A] uppercase tracking-wider whitespace-nowrap shadow-xl z-50 pointer-events-none"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.a>
  );
};
