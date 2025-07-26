import React from "react";
import { Instagram } from "lucide-react";

const Footer = () => {
  const handleInstagramClick = () => {
    // Replace 'tanishareads' with the actual Instagram username
    window.open('https://www.instagram.com/tanishareads7/', '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white font-serif border-t border-white/10">
      <div className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        {/* Left side - empty for balance */}
        <div className="w-10 md:w-12"></div>
        
        {/* Center - Copyright */}
        <div className="text-center">
          <p className="text-white/90 text-sm md:text-base font-light tracking-wide">
            &copy; {new Date().getFullYear()} . All Rights Reserved - TanishaReads
          </p>
        </div>
        
        {/* Right side - Instagram Icon */}
        <div className="flex justify-end">
          <button
            onClick={handleInstagramClick}
            className="group p-2 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer"
            aria-label="Visit TanishaReads on Instagram"
          >
            <Instagram 
              className="w-5 h-5 md:w-6 md:h-6 text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-200" 
            />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;