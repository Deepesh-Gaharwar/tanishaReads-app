import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";
import axios from "../utils/axiosInstance";

const EditBookModal = ({ book, isOpen, onClose, onUpdated }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setTitle(book.title || "");
      setAuthor(book.author || "");
      setGenre(book.genre || "");
      setDescription(book.description || "");
    } else {
      // Clear fields if no book
      setTitle("");
      setAuthor("");
      setGenre("");
      setDescription("");
    }
  }, [book]);

  const handleUpdate = async () => {
    if (!title.trim() || !author.trim() || !genre.trim()) {
      return toast.error("Title, Author, and Genre are required.");
    }
    setLoading(true);
    try {
      await axios.patch(`/api/books/${book._id}`, {
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim(),
        description: description.trim(),
      });
      toast.success("Book updated successfully");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error("Failed to update book");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50" aria-modal="true" role="dialog">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-6 rounded-2xl shadow-2xl border border-purple-700/30 max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-bold mb-6 text-white">Edit Book</Dialog.Title>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-purple-200 text-sm font-medium" htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                className="w-full bg-purple-800/30 border border-purple-600/30 rounded-lg px-3 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200 disabled:opacity-50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-purple-200 text-sm font-medium" htmlFor="author">Author</label>
              <input
                id="author"
                type="text"
                className="w-full bg-purple-800/30 border border-purple-600/30 rounded-lg px-3 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200 disabled:opacity-50"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-purple-200 text-sm font-medium" htmlFor="genre">Genre</label>
              <input
                id="genre"
                type="text"
                className="w-full bg-purple-800/30 border border-purple-600/30 rounded-lg px-3 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200 disabled:opacity-50"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-purple-200 text-sm font-medium" htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                className="w-full bg-purple-800/30 border border-purple-600/30 rounded-lg px-3 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200 resize-none disabled:opacity-50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button 
              className="flex-1 bg-purple-600/50 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={onClose} 
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={handleUpdate} 
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditBookModal;