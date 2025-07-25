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
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg bg-white dark:bg-base-100 p-6 rounded-xl shadow-xl">
          <Dialog.Title className="text-xl font-bold mb-4">Edit Book</Dialog.Title>

          <div className="form-control mb-3">
            <label className="label" htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              className="input input-bordered"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-control mb-3">
            <label className="label" htmlFor="author">Author</label>
            <input
              id="author"
              type="text"
              className="input input-bordered"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-control mb-3">
            <label className="label" htmlFor="genre">Genre</label>
            <input
              id="genre"
              type="text"
              className="input input-bordered"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-control mb-4">
            <label className="label" htmlFor="description">Description</label>
            <textarea
              id="description"
              className="textarea textarea-bordered"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button className="btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditBookModal;
