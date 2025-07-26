import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { Download, Maximize, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`/api/books/${id}`);
      // Adjust to response data structure - expecting data.data.book
      setBook(res.data.data.book);
    } catch (err) {
      toast.error("Failed to load book details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axios.get(`/api/books/${id}/download`, {
        responseType: "blob",
      });

      // Create blob URL and auto-download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${book.title || "book"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Download started");
    } catch (error) {
      toast.error("Download failed");
      console.error(error);
    }
  };

  const openInNewTab = () => {
    if (book?.pdfFile?.url) {
      window.open(book.pdfFile.url, '_blank');
    }
  };

  const toggleFullscreen = async () => {
    if (book?.pdfFile?.url) {
      window.open(book.pdfFile.url, '_blank');
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // Add event listeners for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  if (loading)
    return (
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 min-h-screen flex items-center justify-center p-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-600/50">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-purple-100 text-lg">Loading book...</p>
          </div>
        </div>
      </div>
    );

  if (!book)
    return (
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 min-h-screen flex items-center justify-center p-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/50 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-300 text-lg">Book not found.</p>
        </div>
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-2 sm:p-4 md:p-6 pt-20 sm:pt-24 md:pt-28 lg:pt-20 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Book Details Card */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-600/50 shadow-2xl mb-4 sm:mb-6 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Cover Image */}
            <div className="relative overflow-hidden bg-black/30">
              <div className="aspect-[4/3] sm:aspect-[3/2] md:aspect-[5/3] lg:aspect-auto lg:h-full relative">
                <img
                  src={book.coverImage?.url || "/api/placeholder/400/600"}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </div>

            {/* Book Information */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-10">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  {book.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <p className="text-purple-200 text-lg">
                    by <span className="font-semibold text-white">{book.author || "The Writer"}</span>
                  </p>
                  {book.genre && (
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-full text-purple-200 text-sm font-medium">
                      {book.genre}
                    </span>
                  )}
                </div>
              </div>

              {book.description && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                  <p className="text-purple-100 leading-relaxed text-base">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200 flex items-center justify-center gap-3 group"
                aria-label={`Download PDF of ${book.title}`}
              >
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-purple-600/50 shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-purple-600/30 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              PDF Preview
            </h2>
            
            {/* PDF Control Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={openInNewTab}
                className="px-4 py-2 cursor-pointer bg-gradient-to-r from-indigo-600/80 to-purple-600/80 hover:from-indigo-500/80 hover:to-purple-500/80 text-white rounded-lg font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2 group"
                aria-label="Open PDF in new tab"
                disabled={!book?.pdfFile?.url}
              >
                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden md:inline">Open in New Tab</span>
              </button>
              
              <button
                onClick={toggleFullscreen}
                className="px-4 py-2 cursor-pointer bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-500/80 hover:to-pink-500/80 text-white rounded-lg font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-200 flex items-center gap-2 group"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                <Maximize className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden md:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
              </button>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black p-4' : 'aspect-video'} bg-black/30 rounded-xl overflow-hidden border border-purple-600/30`}>
              <iframe
                src={book.pdfFile?.url || ""}
                title="PDF Preview"
                className="w-full h-full"
                frameBorder="0"
                aria-label={`PDF preview of ${book.title}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;