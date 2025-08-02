// src/pages/Home.jsx

import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Loader } from "lucide-react";
import BookCardPublic from "../components/BookCardPublic";

const genresList = ["All", "Poetry", "Writings", "Thoughts", "Others"];

const Home = () => {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [genre, setGenre] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get("/api/books", {
        withCredentials: true,
      });

      const booksArray = data?.data?.books || data?.books || [];

      // ✅ Filter only public and published books
      const visibleBooks = booksArray.filter(
        (book) => book.status === "published" && book.isPublic === true
      );

      setBooks(visibleBooks);
      setFiltered(visibleBooks);
    } catch (err) {
      console.error("Failed to fetch books", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    let result = [...books];
    if (genre !== "All") {
      result = result.filter(
        (b) => (b.genre || "").toLowerCase() === genre.toLowerCase()
      );
    }
    setFiltered(result);
  }, [genre, books]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex justify-center items-center" aria-live="polite" role="status">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 animate-spin text-purple-300" />
          <span className="text-purple-200 text-lg font-medium">Loading your Experience...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 font-serif tracking-tight">
            The Writer's Library
          </h1>
          <p className="text-purple-200 text-lg sm:text-xl max-w-2xl mx-auto">
            Discover beautiful stories, poetry, and thoughts from talented writers
          </p>
        </div>

        {/* Genre Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
          {genresList.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`
                px-6 py-3 cursor-pointer rounded-full font-medium text-sm sm:text-base transition-all duration-300 transform hover:scale-105
                ${genre === g 
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/25" 
                  : "bg-white/10 backdrop-blur-sm text-purple-200 border border-purple-400/30 hover:bg-white/20 hover:text-white"
                }
              `}
              aria-pressed={genre === g}
              aria-label={`Filter by genre ${g}`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-purple-400/20">
              <p className="text-purple-200 text-lg">No writings found in this category.</p>
              <p className="text-purple-300 text-sm mt-2">Try selecting a different genre or check back later.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 sm:gap-10">
            {filtered.map((book) => (
              <BookCardPublic key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;