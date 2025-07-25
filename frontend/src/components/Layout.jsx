import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer"; // Import Footer

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-serif">
      <NavBar />
      <main className="flex-grow p-4 max-w-6xl mx-auto">
        <Outlet />
      </main>
      <Footer />  {/* Footer added here */}
    </div>
  );
};

export default Layout;
