import React from "react";
import { Eye, Download, User, Star } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "../utils/axiosInstance";

const BookCardPublic = ({ book }) => {
  const genres = book.genre ? [book.genre] : [];

  const downloadFile = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`/api/books/${book._id}/download`, {
        responseType: "blob",
      });

      // Get filename from content-disposition header or use fallback
      const disposition = res.headers["content-disposition"];
      const match = disposition?.match(/filename="?(.+)"?/);
      const filename = match?.[1] || `${book.title}.pdf`;

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Download failed:", error?.message || error);
    }
  };

  // Mock rating and downloads for display (you can replace with actual data)
  const rating = (typeof book.rating === 'object' ? book.rating?.average : book.rating) || 4.8;
  const downloads = book.downloads || Math.floor(Math.random() * 500) + 50;

  return (
    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 rounded-2xl shadow-2xl overflow-hidden hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] border border-purple-700/30 max-w-sm mx-auto">
      {/* Cover Image */}
      <figure className="relative h-56 overflow-hidden">
        <img
          src={book.coverImage?.url || ""}
          alt={book.title}
          className="object-cover h-full w-full"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-purple-600/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            {book.genre || "Fiction"}
          </span>
        </div>
      </figure>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2 leading-tight">
          {book.title}
        </h2>

        {/* Author */}
        <div className="flex items-center text-purple-200 text-sm mb-4">
          <User className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">by {book.author || "The Writer"}</span>
        </div>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {genres.map((genre) => (
            <span
              key={genre}
              className="text-purple-400 text-xs font-medium"
            >
              #{genre.toLowerCase()}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-yellow-400">
            <Star className="w-4 h-4 mr-1 fill-current" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <div className="flex items-center text-purple-300">
            <Download className="w-4 h-4 mr-1" />
            <span className="text-sm">{downloads}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/book/${book._id}`}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 shadow-lg hover:shadow-pink-500/25"
            aria-label={`View details of ${book.title}`}
          >
            <Eye className="w-4 h-4" />
            <span>Read</span>
          </Link>
          <button
            onClick={downloadFile}
            className="bg-purple-600/50 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 border border-purple-500/30 shadow-lg"
            aria-label={`Download ${book.title}`}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCardPublic;