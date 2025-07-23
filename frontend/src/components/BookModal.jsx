import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import toast from "react-hot-toast";

const BookModal = ({ modal, setModal, refresh, handleDelete }) => {
  const { type, book } = modal;

  const [form, setForm] = useState({
    title: book.title,
    author: book.author,
    genre: book.genre,
    description: book.description || "",
    status: book.status || "draft",
    visibility: book.visibility || "public",
  });

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/books/${book._id}`, form);
      toast.success("Book updated");
      setModal({ open: false });
      refresh();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const newVisibility = book.visibility === "public" ? "private" : "public";
      await axios.put(`/api/books/${book._id}/visibility`, { visibility: newVisibility });
      toast.success("Visibility updated");
      setModal({ open: false });
      refresh();
    } catch (err) {
      toast.error("Failed to toggle visibility");
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const newStatus = form.status;
      await axios.put(`/api/books/${book._id}/status`, { status: newStatus });
      toast.success("Status updated");
      setModal({ open: false });
      refresh();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box space-y-4">
        <h3 className="font-bold text-lg">
          {type === "view" && "Book Details"}
          {type === "edit" && "Edit Book"}
          {type === "status" && "Update Status"}
          {type === "toggle" && "Toggle Visibility"}
          {type === "delete" && "Delete Confirmation"}
        </h3>

        {/* View Book */}
        {type === "view" && (
          <div>
            <p><strong>Title:</strong> {book.title}</p>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Status:</strong> {book.status}</p>
            <p><strong>Visibility:</strong> {book.visibility}</p>
            <p><strong>Description:</strong> {book.description}</p>
            <a href={book.fileUrl} target="_blank" rel="noreferrer" className="link link-primary mt-2 inline-block">View File</a>
          </div>
        )}

        {/* Edit Book */}
        {type === "edit" && (
          <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
            <input className="input input-bordered w-full" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" />
            <input className="input input-bordered w-full" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author" />
            <input className="input input-bordered w-full" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} placeholder="Genre" />
            <textarea className="textarea textarea-bordered w-full" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
            <button className="btn btn-success w-full" onClick={handleUpdate}>Save Changes</button>
          </form>
        )}

        {/* Update Status */}
        {type === "status" && (
          <div>
            <select className="select select-bordered w-full" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <button className="btn btn-success w-full mt-2" onClick={handleStatusUpdate}>Update Status</button>
          </div>
        )}

        {/* Toggle Visibility */}
        {type === "toggle" && (
          <div className="space-y-2">
            <p>Current visibility: <strong>{book.visibility}</strong></p>
            <button className="btn btn-warning w-full" onClick={handleToggleVisibility}>
              Make {book.visibility === "public" ? "Private" : "Public"}
            </button>
          </div>
        )}

        {/* Delete Confirmation */}
        {type === "delete" && (
          <div>
            <p>Are you sure you want to delete <strong>{book.title}</strong>?</p>
            <button className="btn btn-error w-full mt-4" onClick={() => {
              handleDelete(book._id);
              setModal({ open: false });
            }}>Confirm Delete</button>
          </div>
        )}

        <div className="modal-action">
          <button className="btn" onClick={() => setModal({ open: false })}>Close</button>
        </div>
      </div>
    </dialog>
  );
};

export default BookModal;
