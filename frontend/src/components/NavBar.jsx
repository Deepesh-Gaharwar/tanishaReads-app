import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../store/userSlice";
import toast from "react-hot-toast";

const NavBar = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(removeUser());
    toast.success("Logged out!");
    navigate("/");
  };

  return (
    <div className="navbar bg-primary text-white px-6">
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold">LitVerse</Link>
      </div>
      <div className="flex gap-4">
        <Link to="/" className="btn btn-sm btn-ghost">Home</Link>

        {user && (
          <>
            <Link to="/upload" className="btn btn-sm btn-ghost">Upload</Link>
            <Link to="/stats" className="btn btn-sm btn-ghost">Stats</Link>
            <button onClick={handleLogout} className="btn btn-sm btn-secondary">Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
