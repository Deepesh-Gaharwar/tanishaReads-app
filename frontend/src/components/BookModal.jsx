import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

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
      toast.success("Article updated successfully");
      refresh();
      closeModal();
    } catch (err) {
     // console.error(err);
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/books/${book._id}`);
      toast.success("Article deleted successfully");
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
          status: book.status,
        });
        toast.success("Status updated");
        refresh();
        closeModal();
      } catch (err) {
        toast.error("Status update failed");
      }
  };

  // const handleDownload = async () => {
  //   try {
  //     const res = await axios.get(`/api/books/${book._id}/download`);
  //     const { downloadUrl, filename } = res.data.data;

  //     const link = document.createElement("a");
  //     link.href = downloadUrl;
  //     link.setAttribute("download", filename || `${book.title}.pdf`);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();

  //     toast.success("Download started");
  //   } catch (error) {
  //     toast.error("Download failed");
  //     console.error(error);
  //   }
  // };

  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 rounded-2xl shadow-2xl border border-purple-700/30 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="font-bold text-xl text-white capitalize mb-6">{type} Article</h3>

          {/* View */}
          {type === "view" && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="bg-purple-800/30 rounded-lg p-3">
                  <p className="text-purple-200 text-sm">Title</p>
                  <p className="text-white font-medium">{book.title}</p>
                </div>
                <div className="bg-purple-800/30 rounded-lg p-3">
                  <p className="text-purple-200 text-sm">Author</p>
                  <p className="text-white font-medium">{book.author}</p>
                </div>
                <div className="bg-purple-800/30 rounded-lg p-3">
                  <p className="text-purple-200 text-sm">Genre</p>
                  <p className="text-white font-medium">{book.genre}</p>
                </div>
                <div className="bg-purple-800/30 rounded-lg p-3">
                  <p className="text-purple-200 text-sm">Description</p>
                  <p className="text-white font-medium">{book.description}</p>
                </div>
                <div className="bg-purple-800/30 rounded-lg p-3">
                  <p className="text-purple-200 text-sm">Status</p>
                  <p className="text-white font-medium">{book.status}</p>
                </div>
                <div className="bg-purple-800/30 rounded-lg p-3">
                  <p className="text-purple-200 text-sm">Visibility</p>
                  <p className="text-white font-medium">{book.isPublic ? "Visible" : "Hidden"}</p>
                </div>
              </div>
              {/* <button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-pink-500/25"
                aria-label={`Download ${book.title}`}
              >
                Download PDF
              </button> */}
            </div>
          )}

          {/* Edit */}
          {type === "edit" && (
            <div className="space-y-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="w-full bg-purple-800/30 border border-purple-600/30 rounded-lg px-3 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200"
              />
              <input
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Author"
                className="w-full bg-purple-800/30 border border-purple-600/30 rounded-lg px-3 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200"
              />
              <input
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                placeholder="Genre"
                className="w-full bg-purple-800/30 border border-purple-600/30 rounded-lg px-3 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                rows="4"
                className="w-full bg-purple-800/30 border border-purple-600/30 rounded-lg px-3 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200 resize-none"
              />
              <button
                onClick={handleUpdate}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-pink-500/25"
                aria-label="Save changes"
              >
                Save Changes
              </button>
            </div>
          )}

          {/* Delete */}
          {type === "delete" && (
            <div className="space-y-6">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-white">
                  Are you sure you want to delete <strong className="text-red-300">{book.title}</strong>?
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleDelete} 
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg" 
                  aria-label="Confirm delete"
                >
                  Delete
                </button>
                <button 
                  onClick={closeModal} 
                  className="flex-1 bg-purple-600/50 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-purple-500/30" 
                  aria-label="Cancel delete"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Toggle Visibility */}
          {type === "toggle" && (
            <div className="space-y-6">
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-white">
                  Make this book <strong className="text-yellow-300">{book.isPublic ? "Hidden" : "Visible"}</strong>?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleToggleVisibility}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg"
                  aria-label="Confirm toggle visibility"
                >
                  Toggle
                </button>
                <button 
                  onClick={closeModal} 
                  className="flex-1 bg-purple-600/50 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-purple-500/30" 
                  aria-label="Cancel toggle visibility"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Status Update */}
          {type === "status" && (
            <div className="space-y-6">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-white">
                    Change status of <strong className="text-blue-300">{book.title}</strong> to{" "}
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-sm capitalize border border-blue-500/30">{book.status}</span>?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleStatusUpdate}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg"
                  aria-label="Confirm status update"
                >
                  Update Status
                </button>
                <button 
                  onClick={closeModal} 
                  className="flex-1 bg-purple-600/50 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-purple-500/30" 
                  aria-label="Cancel status update"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Close for view/edit */}
          {(type === "view" || type === "edit") && (
            <div className="mt-6">
              <button 
                onClick={closeModal} 
                className="w-full bg-purple-600/50 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-purple-500/30" 
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookModal;