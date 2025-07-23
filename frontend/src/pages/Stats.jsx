import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BookModal from "../components/BookModal";

const Stats = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({ title: "", author: "", genre: "", visibility: "" });
  const [modal, setModal] = useState({ open: false, type: "", book: null });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = async () => {
    try {
      let url = `/api/books?limit=5&page=${page}`;
      if (filters.title) url += `&title=${filters.title}`;
      if (filters.author) url += `&author=${filters.author}`;
      if (filters.genre) url += `&genre=${filters.genre}`;
      if (filters.visibility) url += `&visibility=${filters.visibility}`;

      const { data } = await axios.get(url);
      setBooks(data.books);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to fetch books");
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/api/books/stats");
      setStats(data);
    } catch (err) {
      toast.error("Failed to fetch stats");
    }
  };

  useEffect(() => {
    if (!user?.isAdmin) return navigate("/");
    fetchBooks();
    fetchStats();
  }, [page, filters]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/books/${id}`);
      toast.success("Book deleted");
      fetchBooks();
    } catch {
      toast.error("Error deleting");
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Top Stats */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Uploads</div>
          <div className="stat-value">{stats.totalUploads}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Downloads</div>
          <div className="stat-value">{stats.totalDownloads}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <input className="input input-bordered" placeholder="Search Title" onChange={(e) => setFilters({ ...filters, title: e.target.value })} />
        <input className="input input-bordered" placeholder="Author" onChange={(e) => setFilters({ ...filters, author: e.target.value })} />
        <input className="input input-bordered" placeholder="Genre" onChange={(e) => setFilters({ ...filters, genre: e.target.value })} />
        <select className="select select-bordered" onChange={(e) => setFilters({ ...filters, visibility: e.target.value })}>
          <option value="">All</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      {/* Book List */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Visibility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books?.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.status}</td>
                <td>{book.visibility}</td>
                <td className="flex gap-1 flex-wrap">
                  <button className="btn btn-xs btn-info" onClick={() => setModal({ open: true, type: "view", book })}>View</button>
                  <button className="btn btn-xs btn-success" onClick={() => setModal({ open: true, type: "edit", book })}>Edit</button>
                  <button className="btn btn-xs btn-warning" onClick={() => setModal({ open: true, type: "status", book })}>Status</button>
                  <button className="btn btn-xs btn-accent" onClick={() => setModal({ open: true, type: "toggle", book })}>Toggle</button>
                  <button className="btn btn-xs btn-error" onClick={() => setModal({ open: true, type: "delete", book })}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="join mt-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} className={`join-item btn btn-sm ${page === i + 1 ? "btn-primary" : ""}`}>{i + 1}</button>
        ))}
      </div>

      {/* Modal */}
      {modal.open && (
        <BookModal
          modal={modal}
          setModal={setModal}
          refresh={fetchBooks}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Stats;
