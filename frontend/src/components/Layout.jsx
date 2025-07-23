import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="min-h-screen bg-literature-gradient font-serif flex flex-col justify-between">
      <div>
        <NavBar />
        <main className="px-4 md:px-8 py-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
