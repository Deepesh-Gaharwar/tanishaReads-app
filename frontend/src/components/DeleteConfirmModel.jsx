import React from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";
import axios from "../utils/axiosInstance";

const DeleteConfirmModal = ({ book, isOpen, onClose, onDeleted }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/books/${book._id}`);
      toast.success("Book deleted successfully");
      onClose();
      onDeleted();
    } catch (err) {
      toast.error("Failed to delete book");
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50" aria-modal="true" role="dialog">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-6 rounded-2xl shadow-2xl border border-purple-700/30">
          <Dialog.Title className="text-xl font-bold mb-6 text-red-400">
            Confirm Deletion
          </Dialog.Title>
          
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-white">
              Are you sure you want to delete{" "}
              <strong className="text-red-300">{book?.title || "this book"}</strong>?
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              className="flex-1 bg-purple-600/50 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-purple-500/30" 
              onClick={onClose} 
              aria-label="Cancel deletion"
            >
              Cancel
            </button>
            <button 
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-red-500/25" 
              onClick={handleDelete} 
              aria-label="Confirm deletion"
            >
              Yes, Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DeleteConfirmModal;