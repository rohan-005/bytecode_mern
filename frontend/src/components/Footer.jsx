import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 backdrop-blur-md border-t  bottom-0 border-white/10 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
        <div className="flex items-center gap-2 text-lg font-bold">
          <span className="text-blue-200 font-transformer text-2xl">ByteCode</span>
          <span className="text-gray-400">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6 text-gray-300 text-m">
          <a href="https://www.instagram.com/_rohan.005/" target='blank' className="hover:text-cyan-400 transition-colors">Contact</a>
          <a href="https://github.com/rohan-005" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">GitHub</a>
          <a href="https://twitter.com/rohandhanerwal" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
