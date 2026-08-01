/**
 * FloatingNavbar.jsx
 * Premium sharp developer-platform floating navbar.
 * Raycast / VS Code inspired dock with terminal aesthetics.
 * Features bottom active indicator bar and sharp confirmation modal for Logout.
 */

import React, { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";
import {
  IconLayoutNavbarCollapse,
  IconUser,
  IconHome,
  IconBooks,
  IconCode,
  IconCpu,
  IconEdit,
} from "@tabler/icons-react";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const FloatingNavbar = ({ items, className }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const mouseX = useMotionValue(Infinity);
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    setMobileOpen(false);
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const defaultItems = items || [
    { title: "Dashboard", href: "/dashboard", icon: <IconHome size={20} /> },
    { title: "Courses", href: "/courses", icon: <IconBooks size={20} /> },
    { title: "Byte-Compiler", href: "/editor", icon: <IconEdit size={20} /> },
    { title: "Dev Den", href: "/devden", icon: <IconCode size={20} /> },
    { title: "AI", href: "/byteai", icon: <IconCpu size={20} /> },
  ];

  // Ensure Profile item is included before Logout
  const hasProfile = defaultItems.some((i) => i.href === "/profile");
  const navList = hasProfile
    ? defaultItems
    : [
        ...defaultItems,
        { title: "Profile", href: "/profile", icon: <IconUser size={20} /> },
      ];

  return (
    <>
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
          className="hidden md:flex gap-4 px-4 py-3 bg-[#2F3437]/92 backdrop-blur-xl border border-[#626A6E]/70 shadow-xl shadow-black/40 items-center"
        >
          {navList.map((item) => (
            <IconButton
              key={item.title}
              {...item}
              mouseX={mouseX}
              isActive={
                currentPath === item.href ||
                (item.href !== "/" && currentPath.startsWith(item.href))
              }
            />
          ))}

          {/* Desktop Logout Button - Far Right after Profile */}
          <IconButton
            title="LOG OUT"
            icon={
              <LogOut
                size={20}
                className="text-[#E53935] group-hover:text-[#66BB6A] transition-colors"
              />
            }
            onClick={() => setShowLogoutConfirm(true)}
            mouseX={mouseX}
            isLogout={true}
          />
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
                className="absolute top-16 right-0 flex flex-col gap-2 p-3 bg-[#2F3437] border border-[#626A6E] shadow-2xl min-w-[200px]"
              >
                {navList.map((item) => {
                  const isActive =
                    currentPath === item.href ||
                    (item.href !== "/" && currentPath.startsWith(item.href));
                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 bg-[#3A4044] hover:bg-[#454C50] border transition-colors relative ${
                        isActive
                          ? "border-[#66BB6A] text-white"
                          : "border-[#626A6E] text-[#D5DBD6]"
                      }`}
                    >
                      <span
                        className={
                          isActive ? "text-[#66BB6A]" : "text-[#AAB2AD]"
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm font-semibold uppercase tracking-wider font-jetbrains">
                        {item.title}
                      </span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#66BB6A]" />
                      )}
                    </a>
                  );
                })}

                {/* Mobile Drawer Logout Option */}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 bg-[#3A4044] hover:bg-[#454C50] border border-[#626A6E] hover:border-[#66BB6A] text-[#D5DBD6] hover:text-[#66BB6A] transition-colors w-full text-left cursor-pointer group"
                >
                  <LogOut
                    size={18}
                    className="text-[#E53935] group-hover:text-[#66BB6A] transition-colors"
                  />
                  <span className="text-sm font-semibold uppercase tracking-wider font-jetbrains">
                    LOG OUT
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-12 w-12 items-center justify-center bg-[#2F3437] border border-[#626A6E] text-white hover:border-[#66BB6A] hover:text-[#66BB6A] transition-all shadow-lg active:scale-95 cursor-pointer"
            aria-label="Toggle menu"
          >
            <IconLayoutNavbarCollapse size={22} />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Dialog Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", duration: 0.25, bounce: 0.1 }}
              className="relative bg-[#2F3437] border border-[#626A6E] p-6 sm:p-8 max-w-sm w-full shadow-2xl z-10 font-jetbrains"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#3A4044] border border-[#626A6E]">
                  <LogOut className="w-5 h-5 text-[#66BB6A]" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                  Log Out
                </h3>
              </div>

              <p className="text-sm text-[#D5DBD6] mb-6 font-inter leading-relaxed">
                Are you sure you want to log out?
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-[#3A4044] hover:bg-[#454C50] border border-[#626A6E] text-[#D5DBD6] hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#626A6E]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 bg-[#66BB6A] hover:bg-[#52B256] border border-[#66BB6A] text-[#1E2224] text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(102,187,106,0.3)] hover:shadow-[0_0_18px_rgba(102,187,106,0.5)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#66BB6A]"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const IconButton = ({
  icon,
  title,
  href,
  onClick,
  mouseX,
  isActive,
  isLogout,
}) => {
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

  const Content = (
    <motion.div
      style={{ width: springSize, height: springSize }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex items-center justify-center bg-[#3A4044] border transition-all relative cursor-pointer ${
        isLogout
          ? "border-[#626A6E] hover:border-[#66BB6A] text-[#D5DBD6] hover:text-[#66BB6A] hover:bg-[#454C50]"
          : isActive
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
      {(isActive || (hovered && !isLogout)) && (
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
            className={`absolute top-14 left-1/2 px-3 py-1 bg-[#454C50] text-xs font-semibold border uppercase tracking-wider whitespace-nowrap shadow-xl z-50 pointer-events-none ${
              isLogout
                ? "text-[#66BB6A] border-[#66BB6A]"
                : "text-[#F5F7F5] border-[#66BB6A]"
            }`}
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        ref={ref}
        type="button"
        className="relative select-none group focus:outline-none focus:ring-1 focus:ring-[#66BB6A]"
      >
        {Content}
      </button>
    );
  }

  return (
    <motion.a
      href={href}
      ref={ref}
      className="relative select-none group focus:outline-none focus:ring-1 focus:ring-[#66BB6A]"
    >
      {Content}
    </motion.a>
  );
};
