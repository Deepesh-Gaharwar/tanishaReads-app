import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const Upload = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadData = new FormData();
      Object.entries(formData).forEach(([key, value]) => uploadData.append(key, value));

      await axios.post("/api/books", uploadData);
      toast.success("Book uploaded!");
      setFormData({ title: "", author: "", genre: "", file: null });
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">📤 Upload a New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-primary p-6 rounded-lg">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="input input-bordered w-full" required />
        <input type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} className="input input-bordered w-full" required />
        <input type="text" name="genre" placeholder="Genre" value={formData.genre} onChange={handleChange} className="input input-bordered w-full" />
        <input type="file" name="file" accept="application/pdf,image/*,video/*" onChange={handleChange} className="file-input file-input-bordered w-full" required />
        <button type="submit" className="btn btn-accent w-full">Upload</button>
      </form>
    </div>
  );
};

export default Upload;
