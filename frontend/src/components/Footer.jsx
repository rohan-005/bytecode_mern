import React from 'react';
import { IconTerminal2, IconBrandGithub, IconBrandInstagram, IconBrandX } from '@tabler/icons-react';

const Footer = () => {
  return (
    <footer className="w-full py-6 px-6 bg-[#1B1B1B] border-t border-[#4A4A4A] text-white font-jetbrains">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#303030] border border-[#FF6A2A]">
            <IconTerminal2 size={18} className="text-[#FF6A2A]" />
          </div>
          <span className="text-[#FF6A2A] font-bebas text-2xl tracking-wide">ByteCode</span>
          <span className="text-[#8E8E8E] text-xs font-mono">v2.0.0</span>
          <span className="text-[#4A4A4A]">|</span>
          <span className="text-[#CFCFCF] text-xs">© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-xs uppercase tracking-wider text-[#CFCFCF]">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#252422] border border-[#4A4A4A] text-[10px]">
            <span className="w-2 h-2 bg-[#35C759] animate-pulse"></span>
            <span className="text-[#35C759] font-bold">SYSTEM ONLINE</span>
          </div>

          <a
            href={import.meta.env.VITE_INSTAGRAM_URL || "https://www.instagram.com/_rohan.005/"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF6A2A] transition-colors flex items-center gap-1.5"
          >
            <IconBrandInstagram size={14} />
            <span>Contact</span>
          </a>
          <a
            href={import.meta.env.VITE_GITHUB_URL || "https://github.com/rohan-005"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF6A2A] transition-colors flex items-center gap-1.5"
          >
            <IconBrandGithub size={14} />
            <span>GitHub</span>
          </a>
          <a
            href={import.meta.env.VITE_TWITTER_URL || "https://twitter.com/rohandhanerwal"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF6A2A] transition-colors flex items-center gap-1.5"
          >
            <IconBrandX size={14} />
            <span>Twitter</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
