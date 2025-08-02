import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../store/userSlice";
import { toast } from "react-toastify";

const NavBar = () => {
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(removeUser());
    toast.info("Admin logged out Successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
    // Wait 100ms to let the toast show up before navigation
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Check if user is on reading route (adjust this pattern based on your actual reading route)
  const isOnReadingRoute = location.pathname.includes('/read') || location.pathname.includes('/book');

  // Helper function to check if route is active
  const isActiveRoute = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Helper function to get active nav classes
  const getNavClasses = (path, isSpecial = false) => {
    const baseClasses = isSpecial 
      ? "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
      : "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200";
    
    if (isActiveRoute(path)) {
      return isSpecial
        ? `${baseClasses} text-white bg-purple-600 border border-purple-400 shadow-lg`
        : `${baseClasses} text-white bg-purple-700 shadow-md`;
    }
    
    return isSpecial
      ? `${baseClasses} text-white border border-purple-400 hover:bg-white hover:text-purple-800`
      : `${baseClasses} text-purple-100 hover:text-white hover:bg-purple-700`;
  };

  // Helper function for mobile nav classes
  const getMobileNavClasses = (path, isSpecial = false) => {
    const baseClasses = "px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer";
    
    if (isActiveRoute(path)) {
      return isSpecial
        ? `${baseClasses} text-white bg-purple-600 border border-purple-400 shadow-lg`
        : `${baseClasses} text-white bg-purple-700 shadow-md`;
    }
    
    return isSpecial
      ? `${baseClasses} text-white border border-purple-400 hover:bg-white hover:text-purple-800`
      : `${baseClasses} text-purple-100 hover:text-white hover:bg-purple-700`;
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-purple-900/95 backdrop-blur-md text-white px-4 sm:px-6 lg:px-8  py-4 shadow-xl border-b border-purple-700/50 transition-all duration-300"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto lg:mx-0 lg:max-w-full flex items-center justify-between">
          {/* Logo */}
<div className="flex-shrink-0">
  <Link
    to="/"
    className="flex items-center space-x-3 text-2xl sm:text-3xl font-bold font-serif text-white hover:text-purple-200 transition-colors duration-200 group"
    aria-label="Homepage"
  >
    <div className="relative">
      {/* Book Icon with magical elements */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 via-pink-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300 group-hover:scale-105">
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
          <path d="M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
        {/* Sparkle effects */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full opacity-75 group-hover:animate-pulse"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-300 rounded-full opacity-60 group-hover:animate-bounce"></div>
    </div>
    <span>TanishaReads</span>
  </Link>
</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {token ? (
              // Admin view
              <>
                <Link
                  to="/"
                  className={getNavClasses("/")}
                  aria-label="Home"
                >
                  Home
                </Link>
                <Link
                  to="/upload"
                  className={getNavClasses("/upload")}
                  aria-label="Upload"
                >
                  Upload
                </Link>
                <Link
                  to="/stats"
                  className={getNavClasses("/stats")}
                  aria-label="Dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  to="/feedback"
                  className={getNavClasses("/feedback", true)}
                  aria-label="Feedback"
                >
                  Feedback
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 cursor-pointer rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-md"
                  aria-label="Logout"
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              // Public user view
              <>
                {/* Show Home link when on reading route */}
                {isOnReadingRoute && (
                  <Link
                    to="/"
                    className={getNavClasses("/")}
                    aria-label="Home"
                  >
                    Home
                  </Link>
                )}

                {location.pathname === "/admin" && (
                  <Link
                    to="/"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-purple-900 bg-purple-300 hover:bg-purple-200 transition-all duration-200 shadow-md"
                    aria-label="Home"
                  >
                    Home
                  </Link>
                )}

                {location.pathname === "/feedback" && (
                  <Link
                    to="/"
                    className={getNavClasses("/")}
                    aria-label="Home"
                  >
                    Home
                  </Link>
                )}

                <Link
                  to="/feedback"
                  className={getNavClasses("/feedback", true)}
                  aria-label="Feedback"
                >
                  Feedback
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 rounded-lg text-purple-200 hover:text-white hover:bg-purple-700 transition-all duration-200 cursor-pointer"
              aria-label="Toggle mobile menu"
              onClick={toggleMobileMenu}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40  bg-opacity-50 md:hidden cursor-pointer"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Right Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white transform transition-transform duration-300 ease-in-out z-[55] md:hidden shadow-2xl ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4 border-b border-purple-700/30">
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-lg text-purple-200 hover:text-white hover:bg-purple-700 transition-all duration-200 cursor-pointer"
            aria-label="Close mobile menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="px-4 py-4">
          <div className="flex flex-col space-y-3">
            {token ? (
              // Admin mobile view
              <>
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={getMobileNavClasses("/")}
                  aria-label="Home"
                >
                  Home
                </Link>
                <Link
                  to="/upload"
                  onClick={closeMobileMenu}
                  className={getMobileNavClasses("/upload")}
                  aria-label="Upload"
                >
                  Upload
                </Link>
                <Link
                  to="/stats"
                  onClick={closeMobileMenu}
                  className={getMobileNavClasses("/stats")}
                  aria-label="Dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  to="/feedback"
                  onClick={closeMobileMenu}
                  className={getMobileNavClasses("/feedback", true)}
                  aria-label="Feedback"
                >
                  Feedback
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="px-4 py-3 cursor-pointer rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-md text-left"
                  aria-label="Logout"
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              // Public mobile view
              <>
                {/* Show Home link when on reading route */}
                {isOnReadingRoute && (
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className={getMobileNavClasses("/")}
                    aria-label="Home"
                  >
                    Home
                  </Link>
                )}

                {location.pathname === "/admin" && (
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-purple-900 bg-purple-300 hover:bg-purple-200 transition-all duration-200 shadow-md cursor-pointer"
                    aria-label="Home"
                  >
                    Home
                  </Link>
                )}

                {location.pathname === "/feedback" && (
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className={getMobileNavClasses("/")}
                    aria-label="Home"
                  >
                    Home
                  </Link>
                )}

                <Link
                  to="/feedback"
                  onClick={closeMobileMenu}
                  className={getMobileNavClasses("/feedback", true)}
                  aria-label="Feedback"
                >
                  Feedback
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;