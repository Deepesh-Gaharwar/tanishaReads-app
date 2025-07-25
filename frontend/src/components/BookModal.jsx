import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

const BookModal = ({ modal, setModal, refresh }) => {
  const { isOpen, type, book } = modal;

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        genre: book.genre || "",
        description: book.description || "",
      });
    } else {
      setFormData({ title: "", author: "", genre: "", description: "" });
    }
  }, [book]);

  const closeModal = () => setModal({ isOpen: false, type: "", book: null });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/books/${book._id}`, formData);
      toast.success("Book updated successfully");
      refresh();
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/books/${book._id}`);
      toast.success("Book deleted successfully");
      refresh();
      closeModal();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleToggleVisibility = async () => {
    try {
      await axios.put(`/api/books/${book._id}/toggle-visibility`);
      toast.success("Visibility toggled");
      refresh();
      closeModal();
    } catch (err) {
      toast.error("Toggle failed");
    }
  };

    const handleStatusUpdate = async () => {
      try {
        await axios.put(`/api/books/${book._id}/status`, {
          status: book.status, // ✅ Use status passed from BookCardAdmin via Stats
        });
        toast.success("Status updated");
        refresh();
        closeModal();
      } catch (err) {
        toast.error("Status update failed");
      }
  };

  const handleDownload = async () => {
    try {
      const res = await axios.get(`/api/books/${book._id}/download`);
      const { downloadUrl, filename } = res.data.data;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename || `${book.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Download started");
    } catch (error) {
      toast.error("Download failed");
      console.error(error);
    }
  };

  if (!isOpen || !book) return null;

  return (
    <dialog open className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg capitalize mb-2">{type} Book</h3>

        {/* View */}
        {type === "view" && (
          <div className="space-y-2">
            <p><strong>Title:</strong> {book.title}</p>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Description:</strong> {book.description}</p>
            <p><strong>Status:</strong> {book.status}</p>
            <p><strong>Visibility:</strong> {book.isPublic ? "Visible" : "Hidden"}</p>
            <button
              onClick={handleDownload}
              className="btn btn-primary mt-4"
              aria-label={`Download ${book.title}`}
            >
              Download PDF
            </button>
          </div>
        )}

        {/* Edit */}
        {type === "edit" && (
          <div className="space-y-2">
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="input input-bordered w-full"
            />
            <input
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Author"
              className="input input-bordered w-full"
            />
            <input
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              placeholder="Genre"
              className="input input-bordered w-full"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="textarea textarea-bordered w-full"
            />
            <button
              onClick={handleUpdate}
              className="btn btn-primary w-full mt-2"
              aria-label="Save changes"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Delete */}
        {type === "delete" && (
          <div>
            <p>
              Are you sure you want to delete <strong>{book.title}</strong>?
            </p>
            <div className="modal-action">
              <button onClick={handleDelete} className="btn btn-error" aria-label="Confirm delete">
                Delete
              </button>
              <button onClick={closeModal} className="btn" aria-label="Cancel delete">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Toggle Visibility */}
        {type === "toggle" && (
          <div>
            <p>
              Make this book <strong>{book.isPublic ? "Hidden" : "Visible"}</strong>?
            </p>
            <div className="modal-action">
              <button
                onClick={handleToggleVisibility}
                className="btn btn-warning"
                aria-label="Confirm toggle visibility"
              >
                Toggle
              </button>
              <button onClick={closeModal} className="btn" aria-label="Cancel toggle visibility">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Status Update */}
        {type === "status" && (
          <div>
            <p>
                Change status of <strong>{book.title}</strong> to{" "}
                <span className="badge badge-info capitalize">{book.status}</span>?
            </p>
            <div className="modal-action">
              <button
                onClick={handleStatusUpdate}
                className="btn btn-accent"
                aria-label="Confirm status update"
              >
                Update Status
              </button>
              <button onClick={closeModal} className="btn" aria-label="Cancel status update">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Close for view/edit */}
        {(type === "view" || type === "edit") && (
          <div className="modal-action">
            <button onClick={closeModal} className="btn" aria-label="Close modal">
              Close
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default BookModal;
