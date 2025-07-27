import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";

const ToggleVisibilityModal = ({ book, isOpen, onClose, onToggled }) => {
  const [loading, setLoading] = useState(false);

  // Reset loading if modal closed/reopened
  useEffect(() => {
    if (!isOpen) setLoading(false);
  }, [isOpen]);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const updated = await axios.patch(`/api/books/${book._id}/toggle-visibility`);
      const newVisibility = updated?.data?.data?.book?.isPublic;
      toast.success(`Visibility set to ${newVisibility ? "Public" : "Private"}`);
      if (onClose) onClose();
      if (onToggled) onToggled();
    } catch (err) {
      toast.error("Failed to update visibility");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!book) return null;

  return (
    <Dialog 
      open={isOpen} 
      onClose={loading ? () => {} : onClose} 
      className="relative z-50" 
      aria-modal="true" 
      role="dialog"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      
      {/* Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
        <Dialog.Panel className="w-full max-w-md bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 border border-purple-600/50 rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-purple-600/30">
            <Dialog.Title className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                {book.isPublic ? (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              Toggle Visibility
            </Dialog.Title>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-purple-600/30 mb-6">
              <p className="text-purple-100 text-sm leading-relaxed">
                Do you want to make{" "}
                <span className="font-bold text-white">"{book.title}"</span>{" "}
                <span className={`font-bold px-2 py-1 rounded-lg text-xs ${
                  book.isPublic 
                    ? "bg-red-500/20 text-red-300 border border-red-500/30" 
                    : "bg-green-500/20 text-green-300 border border-green-500/30"
                }`}>
                  {book.isPublic ? "Private" : "Public"}
                </span>?
              </p>
              
              {/* Current Status Indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs text-purple-300">
                <span>Current status:</span>
                <span className={`px-2 py-1 rounded-lg font-medium ${
                  book.isPublic 
                    ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}>
                  {book.isPublic ? "Public" : "Private"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                className="w-full sm:w-auto px-6 py-3 bg-black/30 hover:bg-black/40 text-purple-200 hover:text-white border border-purple-600/50 hover:border-purple-500 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClose}
                aria-label="Cancel visibility toggle"
                disabled={loading}
              >
                Cancel
              </button>
              
              <button
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl font-medium shadow-lg hover:shadow-amber-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleToggle}
                aria-label="Confirm visibility toggle"
                disabled={loading}
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
                {loading ? "Changing..." : "Yes, Change"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ToggleVisibilityModal;