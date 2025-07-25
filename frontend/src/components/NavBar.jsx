import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../store/userSlice";
import { toast } from "react-toastify";

const NavBar = () => {
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(removeUser());
    toast.success("✅ Admin logged out!", {
      position: "top-right",
      autoClose: 3000,
    });
    navigate("/");
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-purple-900/95 backdrop-blur-md text-white px-4 sm:px-6 lg:px-8 py-4 shadow-xl border-b border-purple-700/50 transition-all duration-300"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-bold font-serif text-white hover:text-purple-200 transition-colors duration-200"
            aria-label="Homepage"
          >
            TanishaReads
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {token ? (
            // Admin view
            <>
              <Link
                to="/"
                className="px-3 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 transition-all duration-200"
                aria-label="Home"
              >
                Home
              </Link>
              <Link
                to="/upload"
                className="px-3 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 transition-all duration-200"
                aria-label="Upload"
              >
                Upload
              </Link>
              <Link
                to="/stats"
                className="px-3 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 transition-all duration-200"
                aria-label="Dashboard"
              >
                Dashboard
              </Link>
              <Link
                to="/feedback"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white border border-purple-400 hover:bg-white hover:text-purple-800 transition-all duration-200"
                aria-label="Feedback"
              >
                Feedback
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-md"
                aria-label="Logout"
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            // Public user view
            <>
              {location.pathname === "/admin" && (
                <Link
                  to="/"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-purple-900 bg-purple-300 hover:bg-purple-200 transition-all duration-200 shadow-md"
                  aria-label="Admin Login"
                >
                  Home
                </Link>
              )}

              {location.pathname === "/feedback" && (
                <Link
                  to="/"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 transition-all duration-200"
                  aria-label="Home"
                >
                  Home
                </Link>
              )}

              <Link
                to="/feedback"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white border border-purple-400 hover:bg-white hover:text-purple-800 transition-all duration-200"
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
            className="p-2 rounded-lg text-purple-200 hover:text-white hover:bg-purple-700 transition-all duration-200"
            aria-label="Toggle mobile menu"
            onClick={() => {
              const mobileMenu = document.getElementById('mobile-menu');
              mobileMenu.classList.toggle('hidden');
            }}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div id="mobile-menu" className="hidden md:hidden mt-4 pb-2">
        <div className="flex flex-col space-y-2">
          {token ? (
            // Admin mobile view
            <>
              <Link
                to="/"
                className="px-3 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 transition-all duration-200"
                aria-label="Home"
              >
                Home
              </Link>
              <Link
                to="/upload"
                className="px-3 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 transition-all duration-200"
                aria-label="Upload"
              >
                Upload
              </Link>
              <Link
                to="/stats"
                className="px-3 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 transition-all duration-200"
                aria-label="Dashboard"
              >
                Dashboard
              </Link>
              <Link
                to="/feedback"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white border border-purple-400 hover:bg-white hover:text-purple-800 transition-all duration-200"
                aria-label="Feedback"
              >
                Feedback
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200 shadow-md text-left"
                aria-label="Logout"
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            // Public mobile view
            <>
              {location.pathname === "/admin" && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-purple-900 bg-purple-300 hover:bg-purple-200 transition-all duration-200 shadow-md"
                  aria-label="Admin Login"
                >
                  Admin Login
                </Link>
              )}

              {location.pathname === "/feedback" && (
                <Link
                  to="/"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 transition-all duration-200"
                  aria-label="Home"
                >
                  Home
                </Link>
              )}

              <Link
                to="/feedback"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white border border-purple-400 hover:bg-white hover:text-purple-800 transition-all duration-200"
                aria-label="Feedback"
              >
                Feedback
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;