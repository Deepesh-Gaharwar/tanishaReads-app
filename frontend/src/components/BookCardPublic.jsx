import React from "react";
import { Eye, Download } from "lucide-react";
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

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl border border-gray-200 transition-all duration-200">
      <figure className="h-56 bg-gray-100">
        <img
          src={book.coverImage?.url || ""}
          alt={book.title}
          className="object-cover h-full w-full"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg font-semibold">{book.title}</h2>
        <div className="text-sm text-gray-600 mb-2 italic">
          by {book.author || "The Writer"}
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <span
              key={genre}
              className="badge badge-outline badge-primary capitalize"
            >
              {genre}
            </span>
          ))}
        </div>
        <div className="card-actions justify-between items-center mt-4">
          <Link
            to={`/book/${book._id}`}
            className="btn btn-sm btn-primary"
            aria-label={`View details of ${book.title}`}
          >
            <Eye className="w-4 h-4 mr-1" /> View
          </Link>
          <button
            onClick={downloadFile}
            className="btn btn-sm btn-accent"
            aria-label={`Download ${book.title}`}
          >
            <Download className="w-4 h-4 mr-1" /> Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCardPublic;
