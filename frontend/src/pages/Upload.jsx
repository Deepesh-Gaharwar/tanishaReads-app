import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UploadBook = () => {
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    status: "published", // <-- added status with default
    description: "",
    cover: null,
    file: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cover" || name === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cover || !formData.file) {
      toast.error("Please upload both cover and PDF file.");
      return;
    }
    if (!formData.title.trim() || !formData.author.trim() || !formData.genre.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("author", formData.author.trim());
    data.append("genre", formData.genre.trim());
    data.append("status", formData.status); // <-- include status
    data.append("description", formData.description.trim());
    data.append("coverImage", formData.cover);
    data.append("pdfFile", formData.file);

    setLoading(true);
    try {
      await axios.post("/api/books", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Book uploaded successfully!");
      navigate("/stats");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload a New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data" noValidate>
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
          aria-label="Book Title"
        />
        <input
          type="text"
          name="author"
          placeholder="Author Name"
          value={formData.author}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
          aria-label="Author Name"
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre (e.g., Poetry, Essay)"
          value={formData.genre}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
          aria-label="Genre"
        />

        {/* 👇 New status dropdown added below genre */}
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="select select-bordered w-full"
          required
          aria-label="Status"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <textarea
          name="description"
          placeholder="Short description..."
          value={formData.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full"
          rows={3}
          aria-label="Book Description"
        ></textarea>
        <input
          type="file"
          name="cover"
          accept="image/*"
          onChange={handleChange}
          className="file-input file-input-bordered w-full"
          required
          aria-label="Upload Cover Image"
        />
        <input
          type="file"
          name="file"
          accept="application/pdf"
          onChange={handleChange}
          className="file-input file-input-bordered w-full"
          required
          aria-label="Upload PDF File"
        />
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default UploadBook;
