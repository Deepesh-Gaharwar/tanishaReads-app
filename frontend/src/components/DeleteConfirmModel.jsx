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
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white dark:bg-base-100 p-6 rounded-xl shadow-xl">
          <Dialog.Title className="text-lg font-bold mb-4 text-red-600">
            Confirm Deletion
          </Dialog.Title>
          <p>
            Are you sure you want to delete{" "}
            <strong>{book?.title || "this book"}</strong>?
          </p>

          <div className="flex justify-end gap-2 mt-6">
            <button className="btn" onClick={onClose} aria-label="Cancel deletion">
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleDelete} aria-label="Confirm deletion">
              Yes, Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DeleteConfirmModal;
