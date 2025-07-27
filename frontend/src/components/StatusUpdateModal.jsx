import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";

const StatusUpdateModal = ({ book, isOpen, onClose, onStatusUpdated }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) setLoading(false);
  }, [isOpen]);

  const handleStatusUpdate = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const nextStatus = book.status === "published" ? "draft" : "published";
      const res = await axios.patch(`/api/books/${book._id}/status`, {
        status: nextStatus,
      });
      const updatedStatus = res?.data?.data?.book?.status;
      toast.success(`Status updated to ${updatedStatus}`);
      if (onClose) onClose();
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      toast.error("Failed to update status");
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
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              Update Book Status
            </Dialog.Title>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-purple-600/30 mb-6">
              <p className="text-purple-100 text-sm leading-relaxed">
                Do you want to{" "}
                <span className="font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {book.status === "published" ? "mark as Draft" : "Publish"}
                </span>{" "}
                the book{" "}
                <span className="font-bold text-white">"{book.title}"</span>?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                className="w-full sm:w-auto px-6 py-3 bg-black/30 hover:bg-black/40 text-purple-200 hover:text-white border border-purple-600/50 hover:border-purple-500 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClose}
                aria-label="Cancel status update"
                disabled={loading}
              >
                Cancel
              </button>
              
              <button
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-medium shadow-lg hover:shadow-purple-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleStatusUpdate}
                aria-label="Confirm status update"
                disabled={loading}
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
                {loading ? "Updating..." : "Yes, Update"}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default StatusUpdateModal;