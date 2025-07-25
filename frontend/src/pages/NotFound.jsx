import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 p-4 sm:p-6 lg:p-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl border border-white/20 max-w-md w-full text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 text-white bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-purple-100 leading-relaxed">
          Oops! The page you are looking for does not exist.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300/50"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;