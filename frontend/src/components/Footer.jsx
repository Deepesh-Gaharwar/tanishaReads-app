import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white font-serif border-t border-white/10">
      <div className="flex justify-center items-center p-6">
        <div className="text-center">
          <p className="text-white/90 text-sm md:text-base font-light tracking-wide">
            &copy; {new Date().getFullYear()} LitVerse — Curated by Literature Lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;