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
      const { data } = await axios.get("/api/books");
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
      <div className="flex justify-center items-center h-64" aria-live="polite" role="status">
        <Loader className="w-8 h-8 animate-spin text-primary" />
        <span className="sr-only">Loading books...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary font-serif">
        The Writer's Library
      </h1>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {genresList.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`btn btn-sm ${genre === g ? "btn-primary" : "btn-outline"}`}
            aria-pressed={genre === g}
            aria-label={`Filter by genre ${g}`}
          >
            {g}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No writings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((book) => (
            <BookCardPublic key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
