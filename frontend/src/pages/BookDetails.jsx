import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`/api/books/${id}`);
      // Adjust to response data structure - expecting data.data.book
      setBook(res.data.data.book);
    } catch (err) {
      toast.error("Failed to load book details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axios.get(`/api/books/${id}/download`, {
        responseType: "blob",
      });

      // Create blob URL and auto-download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${book.title || "book"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Download started");
    } catch (error) {
      toast.error("Download failed");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  if (loading)
    return <p className="p-6 text-center">Loading book...</p>;

  if (!book)
    return (
      <p className="p-6 text-center text-red-500">Book not found.</p>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="card bg-base-100 shadow-xl mb-6">
        <figure className="max-h-96 overflow-hidden">
          <img
            src={book.coverImage?.url || ""}
            alt={book.title}
            className="object-cover w-full h-96"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-2xl">{book.title}</h2>
          <p className="text-sm text-gray-600">
            by {book.author || "The Writer"}
          </p>
          <p className="text-sm text-gray-600 italic">{book.genre}</p>
          <p className="mt-4">{book.description}</p>
          <button
            onClick={handleDownload}
            className="btn btn-primary mt-6 w-fit flex items-center"
            aria-label={`Download PDF of ${book.title}`}
          >
            <Download className="w-4 h-4 mr-1" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="aspect-video border rounded-xl overflow-hidden shadow-md">
        <iframe
          src={book.pdfFile?.url || ""}
          title="PDF Preview"
          className="w-full h-full"
          frameBorder="0"
          aria-label={`PDF preview of ${book.title}`}
        />
      </div>
    </div>
  );
};

export default BookDetails;
