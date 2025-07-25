import React, { useEffect, useState } from "react";
import { Loader, ExternalLink, Maximize } from "lucide-react";

// Mock components and hooks for demonstration
const useParams = () => ({ id: "1" });
const axios = {
  get: () => Promise.resolve({
    data: {
      data: {
        book: {
          title: "Whispers of the Soul",
          author: "Tanisha",
          genre: "Poetry",
          pdfFile: { url: "https://example.com/sample.pdf" }
        }
      }
    }
  })
};
const toast = { error: () => {} };

const ReadBookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`/api/books/${id}`);
      if (res.data && res.data.data && res.data.data.book) {
        setBook(res.data.data.book);
      } else {
        toast.error("Book data not found");
      }
    } catch (err) {
      toast.error("Failed to load book");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const openInNewTab = () => {
    if (book?.pdfFile?.url) {
      window.open(book.pdfFile.url, '_blank');
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800" role="status" aria-live="polite">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="animate-spin h-12 w-12 text-purple-300" />
          <span className="text-purple-200 text-lg font-medium">Loading book...</span>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800" role="alert">
        <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <h2 className="text-2xl font-serif text-white mb-2">Book not found</h2>
          <p className="text-purple-200">The requested book could not be loaded.</p>
        </div>
      </div>
    );
  }

  // Convert single genre string to array for consistent badge rendering
  const genres = book.genre ? [book.genre] : [];

  // Check if PDF URL exists and is non-empty string
  const pdfUrl = book.pdfFile?.url && book.pdfFile.url.trim() !== "" ? book.pdfFile.url : null;

  // Fullscreen view
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* Fullscreen controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={openInNewTab}
            className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 shadow-lg"
            title="Open in new tab"
          >
            <ExternalLink className="h-5 w-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 shadow-lg"
            title="Exit fullscreen"
          >
            <Maximize className="h-5 w-5" />
          </button>
        </div>

        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title={`Read book: ${book.title}`}
            className="w-full h-full border-0"
            aria-label={`Read book: ${book.title}`}
          />
        ) : (
          <div className="flex justify-center items-center h-full text-white text-xl">
            PDF preview not available.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Book Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-8 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-white">
            {book.title}
          </h1>
          <p className="text-purple-200 text-xl mb-6 font-light">
            by {book.author || "The Writer"}
          </p>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6">
              {genres.map((genre) => (
                <span 
                  key={genre} 
                  className="px-4 py-2 bg-purple-500/30 backdrop-blur-sm border border-purple-400/50 rounded-full text-purple-200 text-sm font-medium capitalize"
                >
                  #{genre}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={toggleFullscreen}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Maximize className="h-5 w-5" />
              Read Fullscreen
            </button>
            <button
              onClick={openInNewTab}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-xl font-medium transition-all duration-200 backdrop-blur-sm flex items-center gap-2"
            >
              <ExternalLink className="h-5 w-5" />
              Open in New Tab
            </button>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 shadow-2xl">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title={`Read book: ${book.title}`}
              className="w-full h-[70vh] rounded-xl border-0"
              aria-label={`Read book: ${book.title}`}
            />
          ) : (
            <div className="flex justify-center items-center h-96 text-purple-200 text-lg">
              <div className="text-center">
                <p className="mb-4">PDF preview not available.</p>
                <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
                  📚
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadBookPage;