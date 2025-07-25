import React, { useEffect, useState, useCallback } from "react";
import axios from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import BookCardAdmin from "../components/BookCardAdmin";
import BookModal from "../components/BookModal";

const Stats = () => {
  const user = useSelector((state) => state.user);
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ genre: "", visibility: "" });
  const [modal, setModal] = useState({ isOpen: false, type: "", book: null });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const fetchBooks = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const { data } = await axios.get("/api/books", {
        params: {
            search: search || undefined,
            genre: filter.genre || undefined,
            status: filter.visibility || undefined,
            page: pagination.page,
        },

        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setBooks(data?.data?.books || []);
      setPagination({
        page: data?.data?.pagination?.currentPage || 1,
        totalPages: data?.data?.pagination?.totalPages || 1,
      });
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  }, [search, filter, pagination.page, user?.token]);

 const fetchGenres = useCallback(async () => {
  if (!user?.token) return;
  try {
    const { data } = await axios.get("/api/books/genres", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    setGenres(data?.genres || []);
  } catch (err) {
    console.error("Error fetching genres:", err);
  }
}, [user?.token]);


  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filter.genre, filter.visibility]);

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-4">📊 Admin Dashboard</h2>

      {/* Filters */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by title"
          className="input input-bordered"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search by book title"
        />

        <select
          className="select select-bordered"
          value={filter.genre}
          onChange={(e) => setFilter({ ...filter, genre: e.target.value })}
          aria-label="Filter by genre"
        >
          <option value="">All Genres</option>
          {genres.length > 0 ? (
            genres.map((genre, idx) => (
              <option key={idx} value={genre}>
                {genre}
              </option>
            ))
          ) : (
            <option disabled>Loading genres...</option>
          )}
        </select>

        <select
              className="select select-bordered"
              value={filter.visibility}
              onChange={(e) => setFilter({ ...filter, visibility: e.target.value })}
              aria-label="Filter by status"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
        </select>


        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {/* Stats Summary */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Work Uploads</div>
            <div className="stat-value">{books.length}</div>
          </div>
        </div>
      </div>

      {/* Book Cards */}
      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCardAdmin
              key={book._id}
              book={book}
              onView={() => setModal({ isOpen: true, type: "view", book })}
              onEdit={() => setModal({ isOpen: true, type: "edit", book })}
              onDelete={() => setModal({ isOpen: true, type: "delete", book })}
              onToggleVisibility={() => setModal({ isOpen: true, type: "toggle", book })}
              onUpdateStatus={(updatedBook) => setModal({ isOpen: true, type: "status", book: updatedBook })
}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="btn btn-outline"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1 || loading}
          aria-label="Previous page"
        >
          Prev
        </button>
        <span className="px-4 py-2">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          className="btn btn-outline"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages || loading}
          aria-label="Next page"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      <BookModal modal={modal} setModal={setModal} refresh={fetchBooks} />
    </div>
  );
};

export default Stats;
