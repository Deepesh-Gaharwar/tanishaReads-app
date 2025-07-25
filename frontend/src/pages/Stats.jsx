import React, { useEffect, useState, useCallback } from "react";
import axios from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import { Shield, Loader } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 p-4 md:p-8 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-8 h-8 md:w-10 md:h-10 text-purple-300" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Admin Dashboard</h2>
          </div>
          <p className="text-purple-200">Manage your books and track performance</p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by title"
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search by book title"
            />

            <select
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              value={filter.genre}
              onChange={(e) => setFilter({ ...filter, genre: e.target.value })}
              aria-label="Filter by genre"
            >
              <option value="" className="bg-purple-800 text-white">All Genres</option>
              {genres.length > 0 ? (
                genres.map((genre, idx) => (
                  <option key={idx} value={genre} className="bg-purple-800 text-white">
                    {genre}
                  </option>
                ))
              ) : (
                <option disabled className="bg-purple-800 text-white">Loading genres...</option>
              )}
            </select>

            <select
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
              value={filter.visibility}
              onChange={(e) => setFilter({ ...filter, visibility: e.target.value })}
              aria-label="Filter by status"
            >
              <option value="" className="bg-purple-800 text-white">All Status</option>
              <option value="published" className="bg-purple-800 text-white">Published</option>
              <option value="draft" className="bg-purple-800 text-white">Draft</option>
              <option value="archived" className="bg-purple-800 text-white">Archived</option>
            </select>

            <button 
              type="submit" 
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </form>
        </div>

        {/* Stats Summary */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="text-center">
              <div className="text-purple-200 text-sm font-medium mb-1">Total Work Uploads</div>
              <div className="text-3xl font-bold text-white">{books.length}</div>
            </div>
          </div>
        </div>

        {/* Book Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader className="w-12 h-12 animate-spin text-purple-300" />
              <span className="text-purple-200 text-lg font-medium">Loading books...</span>
            </div>
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center">
            <p className="text-purple-200 text-lg">No books found.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {books.map((book) => (
              <BookCardAdmin
                key={book._id}
                book={book}
                onView={() => setModal({ isOpen: true, type: "view", book })}
                onEdit={() => setModal({ isOpen: true, type: "edit", book })}
                onDelete={() => setModal({ isOpen: true, type: "delete", book })}
                onToggleVisibility={() => setModal({ isOpen: true, type: "toggle", book })}
                onUpdateStatus={(updatedBook) => setModal({ isOpen: true, type: "status", book: updatedBook })}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 py-8">
          <button
            className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium rounded-xl border border-white/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1 || loading}
            aria-label="Previous page"
          >
            Prev
          </button>
          <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white font-medium">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <button
            className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium rounded-xl border border-white/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
    </div>
  );
};

export default Stats;