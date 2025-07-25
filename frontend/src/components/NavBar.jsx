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
      className="navbar bg-primary text-white px-4 py-2 shadow-md"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex-1">
        <Link
          to="/"
          className="text-2xl font-bold font-serif"
          aria-label="Homepage"
        >
          LitSpace
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        {token ? (
          // Admin view
          <>
            <Link
              to="/"
              className="btn btn-sm btn-ghost text-white"
              aria-label="Home"
            >
              Home
            </Link>
            <Link
              to="/upload"
              className="btn btn-sm btn-ghost text-white"
              aria-label="Upload"
            >
              Upload
            </Link>
            <Link
              to="/stats"
              className="btn btn-sm btn-ghost text-white"
              aria-label="Dashboard"
            >
              Dashboard
            </Link>
            <Link
              to="/feedback"
              className="btn btn-sm btn-outline text-white border-white hover:bg-white hover:text-purple-700"
              aria-label="Feedback"
            >
              Feedback
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-error text-white"
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
                to="/admin"
                className="btn btn-sm btn-accent"
                aria-label="Admin Login"
              >
                Admin Login
              </Link>
            )}

            {location.pathname === "/feedback" && (
              <Link
                to="/"
                className="btn btn-sm btn-ghost text-white"
                aria-label="Home"
              >
                Home
              </Link>
            )}

            <Link
              to="/feedback"
              className="btn btn-sm btn-outline text-white border-white hover:bg-white hover:text-purple-700"
              aria-label="Feedback"
            >
              Feedback
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
