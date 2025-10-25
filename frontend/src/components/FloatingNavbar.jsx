/**
 * FloatingNavbar.jsx
 * Smooth, responsive floating navbar for desktop + mobile.
 * Instant hover feedback and snappy animations.
 */

import React, { useRef, useState } from "react";
import {
  // eslint-disable-next-line no-unused-vars
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
        "fixed top-6 right-10 flex items-center justify-center z-50",
        className
      )}
    >
      {/* Desktop Navbar */}
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="hidden md:flex gap-4 px-4 py-3 rounded-2xl "
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-14 right-0 flex flex-col gap-2"
            >
              {items.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  title={item.title}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-900 text-white active:scale-95 transition-transform"
                >
                  {item.icon}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-900 text-white active:scale-95 transition-transform"
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

  // Distance from cursor to center
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Smoother, snappier scaling
  const size = useTransform(distance, [-120, 0, 120], [40, 70, 40]);
  const iconSize = useTransform(distance, [-120, 0, 120], [20, 35, 20]);

  const springSize = useSpring(size, { stiffness: 400, damping: 18 });
  const springIcon = useSpring(iconSize, { stiffness: 400, damping: 18 });

  return (
    <motion.a href={href} ref={ref} className="relative select-none">
      <motion.div
        style={{ width: springSize, height: springSize }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex items-center justify-center rounded-full bg-neutral-800 text-white hover:scale-1.2"
      >
        <motion.div
          style={{ width: springIcon, height: springIcon }}
          className="flex items-center justify-center "
        >
          {icon}
        </motion.div>

        {/* Instant tooltip (no delay) */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 6, x: "-50%" }}
              transition={{ duration: 0.1 }}
              className="absolute -top-8 left-1/2 px-2 py-0.5 rounded-md bg-neutral-800 text-s text-white border border-neutral-700 whitespace-nowrap"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.a>
  );
};
