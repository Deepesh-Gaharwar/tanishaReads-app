import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Link } from "react-router-dom";

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
  const fetchBooks = async () => {
    try {
      const res = await axios.get("/api/books");
      const booksArray = res.data?.data?.books;

      if (Array.isArray(booksArray)) {
        setBooks(booksArray);
      } else {
        console.error("Unexpected response format:", res.data);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  fetchBooks();
}, []);


  return (
    <div className="p-6 text-white">
      <h1 className="text-4xl font-bold mb-6">📚 Explore Literary Treasures</h1>

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book._id} className="bg-primary p-4 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-sm italic">{book.author}</p>
              <Link to={`/book/${book._id}`} className="btn btn-sm mt-4 btn-accent">
                Read More
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
