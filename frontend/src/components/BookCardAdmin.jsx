import React, { useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Download,
  EyeOff,
  Eye as EyeIcon,
  CheckCheck,
  Archive,
} from "lucide-react";

const BookCardAdmin = ({
  book,
  onView,
  onEdit,
  onDelete,
  onToggleVisibility,
  onUpdateStatus,
  onDownload,
}) => {
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
 // const [isDownloading, setIsDownloading] = useState(false);

  const handleToggleVisibility = async () => {
    if (isTogglingVisibility) return;
    setIsTogglingVisibility(true);
    try {
      const updatedBook = { ...book, isPublic: !book.isPublic };
      await onToggleVisibility(updatedBook);
    } catch (error) {
      console.error("Toggle visibility failed:", error);
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    try {
      const updatedBook = { ...book, status: newStatus };
      await onUpdateStatus(updatedBook);
    } catch (error) {
      console.error("Update status failed:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // const handleDownload = async () => {
  //   if (isDownloading) return;
  //   setIsDownloading(true);
  //   try {
  //     await onDownload(book);
  //   } catch (error) {
  //     console.error("Download failed:", error);
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "archived":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "draft":
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 rounded-2xl shadow-2xl p-4 sm:p-6 hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] border border-purple-700/30">
      <figure className="mb-4">
        <img
          src={book.coverImage?.url || ""}
          alt={book.title}
          className="h-48 object-cover w-full rounded-xl shadow-lg"
        />
      </figure>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">{book.title}</h2>
          <p className="text-sm text-purple-200 mb-1">By {book.author}</p>
          <p className="text-xs text-purple-300">Genre: {book.genre}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-purple-300">
            Status:{" "}
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(book.status)}`}>
              {book.status}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-purple-300">
            Visibility:{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                book.isPublic 
                  ? "bg-blue-100 text-blue-800 border-blue-200" 
                  : "bg-gray-100 text-gray-800 border-gray-200"
              }`}
            >
              {book.isPublic ? "Public" : "Private"}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-lg"
            onClick={() => onView(book)}
            aria-label={`View ${book.title}`}
          >
            <Eye className="w-4 h-4" /> View
          </button>
          
          <button
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-lg"
            onClick={() => onEdit(book)}
            aria-label={`Edit ${book.title}`}
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          
          <button
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-lg"
            onClick={() => onDelete(book)}
            aria-label={`Delete ${book.title}`}
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>

          <button
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-lg"
            onClick={handleToggleVisibility}
            disabled={isTogglingVisibility}
            aria-label="Toggle Visibility"
          >
            {book.isPublic ? <EyeOff className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            Toggle Visibility
          </button>

          {/* Status-based actions */}
          {book.status === "draft" && (
            <>
              <button
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-lg"
                onClick={() => handleUpdateStatus("published")}
                disabled={isUpdatingStatus}
                aria-label="Publish"
              >
                <CheckCheck className="w-4 h-4" /> Publish
              </button>
              <button
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-lg"
                onClick={() => handleUpdateStatus("archived")}
                disabled={isUpdatingStatus}
                aria-label="Archive"
              >
                <Archive className="w-4 h-4" /> Make Archived
              </button>
            </>
          )}

          {book.status === "published" && (
            <>
              <button
                className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-lg"
                onClick={() => handleUpdateStatus("draft")}
                disabled={isUpdatingStatus}
                aria-label="Mark Draft"
              >
                <CheckCheck className="w-4 h-4" /> Mark Draft
              </button>
              <button
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-lg"
                onClick={() => handleUpdateStatus("archived")}
                disabled={isUpdatingStatus}
                aria-label="Archive"
              >
                <Archive className="w-4 h-4" /> Make Archived
              </button>
            </>
          )}

          {book.status === "archived" && (
            <>
              <button
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-lg"
                onClick={() => handleUpdateStatus("published")}
                disabled={isUpdatingStatus}
                aria-label="Publish"
              >
                <CheckCheck className="w-4 h-4" /> Publish
              </button>
              <button
                className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-lg"
                onClick={() => handleUpdateStatus("draft")}
                disabled={isUpdatingStatus}
                aria-label="Mark Draft"
              >
                <CheckCheck className="w-4 h-4" /> Mark Draft
              </button>
            </>
          )}

          {/* <button
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-lg border border-purple-400/30"
            onClick={handleDownload}
            aria-label={`Download ${book.title}`}
            disabled={isDownloading}
          >
            <Download className="w-4 h-4" /> Download
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default BookCardAdmin;