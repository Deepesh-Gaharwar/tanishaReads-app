import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 p-4 md:p-8 pt-20 md:pt-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Upload className="w-8 h-8 md:w-10 md:h-10" />
            Upload Your New Work Here
          </h2>
          <p className="text-purple-200">Share your literary work with the world</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data" noValidate>
            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-200">Book Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Enter your book title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                required
                aria-label="Book Title"
              />
            </div>

            {/* Author Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-200">Author Name *</label>
              <input
                type="text"
                name="author"
                placeholder="Enter author name"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                required
                aria-label="Author Name"
              />
            </div>

            {/* Genre and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-200">Genre *</label>
                <input
                  type="text"
                  name="genre"
                  placeholder="e.g., Poetry, Essay, Fiction"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  required
                  aria-label="Genre"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-200">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  required
                  aria-label="Status"
                >
                  <option value="draft" className="bg-purple-800 text-white">Draft</option>
                  <option value="published" className="bg-purple-800 text-white">Published</option>
                  <option value="archived" className="bg-purple-800 text-white">Archived</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-200">Description</label>
              <textarea
                name="description"
                placeholder="Write a short description of your book..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
                rows={4}
                aria-label="Book Description"
              ></textarea>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-200">Cover Image *</label>
                <div className="relative">
                  <input
                    type="file"
                    name="cover"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-600 file:text-white hover:file:bg-red-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    required
                    aria-label="Upload Cover Image"
                  />
                </div>
                {formData.cover && (
                  <p className="text-xs text-purple-200 mt-1">
                    Selected: {formData.cover.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-200">PDF File *</label>
                <div className="relative">
                  <input
                    type="file"
                    name="file"
                    accept="application/pdf"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-600 file:text-white hover:file:bg-red-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    required
                    aria-label="Upload PDF File"
                  />
                </div>
                {formData.file && (
                  <p className="text-xs text-purple-200 mt-1">
                    Selected: {formData.file.name}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Uploading...
                </div>
              ) : (
                "Upload Book"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadBook;