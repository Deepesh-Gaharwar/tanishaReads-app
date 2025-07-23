import React from "react";

const Footer = () => {
  return (
    <footer className="footer footer-center p-4 bg-primary text-white font-serif">
      <aside>
        <p>&copy; {new Date().getFullYear()} LitVerse — Curated by Literature Lovers</p>
      </aside>
    </footer>
  );
};

export default Footer;
