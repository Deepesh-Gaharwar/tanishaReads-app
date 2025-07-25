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
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await onDownload(book);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "published":
        return "badge-success";
      case "archived":
        return "badge-warning";
      case "draft":
      default:
        return "badge-neutral";
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg p-4">
      <figure>
        <img
          src={book.coverImage?.url || ""}
          alt={book.title}
          className="h-48 object-cover w-full rounded"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-primary">{book.title}</h2>
        <p className="text-sm text-gray-500">By {book.author}</p>
        <p className="text-xs">Genre: {book.genre}</p>
        <p className="text-xs">
          Status:{" "}
          <span className={`badge ${getStatusBadgeClass(book.status)}`}>
            {book.status}
          </span>
        </p>
        <p className="text-xs">
          Visibility:{" "}
          <span
            className={`badge ${book.isPublic ? "badge-info" : "badge-neutral"}`}
          >
            {book.isPublic ? "Public" : "Private"}
          </span>
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onView(book)}
            aria-label={`View ${book.title}`}
          >
            <Eye className="w-4 h-4" /> View
          </button>
          <button
            className="btn btn-sm btn-accent"
            onClick={() => onEdit(book)}
            aria-label={`Edit ${book.title}`}
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button
            className="btn btn-sm btn-error"
            onClick={() => onDelete(book)}
            aria-label={`Delete ${book.title}`}
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>

          {/* Toggle Visibility (Always available) */}
          <button
            className="btn btn-sm btn-warning"
            onClick={handleToggleVisibility}
            disabled={isTogglingVisibility}
            aria-label="Toggle Visibility"
          >
            {book.isPublic ? <EyeOff className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            {/* {book.isPublic ? "Make Private" : "Make Public"} */}
            Toggle Visibility
          </button>

          {/* Status-based actions */}
          {book.status === "draft" && (
            <>
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleUpdateStatus("published")}
                disabled={isUpdatingStatus}
                aria-label="Publish"
              >
                <CheckCheck className="w-4 h-4" /> Publish
              </button>
              <button
                className="btn btn-sm btn-warning"
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
                className="btn btn-sm btn-neutral"
                onClick={() => handleUpdateStatus("draft")}
                disabled={isUpdatingStatus}
                aria-label="Mark Draft"
              >
                <CheckCheck className="w-4 h-4" /> Mark Draft
              </button>
              <button
                className="btn btn-sm btn-warning"
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
                className="btn btn-sm btn-success"
                onClick={() => handleUpdateStatus("published")}
                disabled={isUpdatingStatus}
                aria-label="Publish"
              >
                <CheckCheck className="w-4 h-4" /> Publish
              </button>
              <button
                className="btn btn-sm btn-neutral"
                onClick={() => handleUpdateStatus("draft")}
                disabled={isUpdatingStatus}
                aria-label="Mark Draft"
              >
                <CheckCheck className="w-4 h-4" /> Mark Draft
              </button>
            </>
          )}

          <button
            className="btn btn-sm btn-outline"
            onClick={handleDownload}
            aria-label={`Download ${book.title}`}
            disabled={isDownloading}
          >
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCardAdmin;
