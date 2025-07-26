import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <NavBar />
      
      {/* Main Content Area */}
      <main className="flex-grow pt-10 sm:pt-10 md:pt-10">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;