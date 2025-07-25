import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";

const ReadBookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`/api/books/${id}`);
      if (res.data && res.data.data && res.data.data.book) {
        setBook(res.data.data.book);
      } else {
        toast.error("Book data not found");
      }
    } catch (err) {
      toast.error("Failed to load book");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80" role="status" aria-live="polite">
        <Loader className="animate-spin h-8 w-8 text-primary" />
        <span className="sr-only">Loading book...</span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center mt-10 text-gray-600" role="alert">
        Book not found.
      </div>
    );
  }

  // Convert single genre string to array for consistent badge rendering
  const genres = book.genre ? [book.genre] : [];

  // Check if PDF URL exists and is non-empty string
  const pdfUrl = book.pdfFile?.url && book.pdfFile.url.trim() !== "" ? book.pdfFile.url : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-semibold mb-2 text-primary">{book.title}</h1>
      <p className="text-gray-700 text-lg mb-4">by {book.author || "The Writer"}</p>

      {genres.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {genres.map((genre) => (
            <span key={genre} className="badge badge-outline badge-primary capitalize">
              {genre}
            </span>
          ))}
        </div>
      )}

      {/* Conditionally render iframe if PDF URL exists */}
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          title={`Read book: ${book.title}`}
          className="w-full h-[80vh] border rounded-md shadow-lg"
          aria-label={`Read book: ${book.title}`}
        />
      ) : (
        <p className="text-center text-red-500">PDF preview not available.</p>
      )}
    </div>
  );
};

export default ReadBookPage;
