import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";
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
    <Dialog open={isOpen} onClose={loading ? () => {} : onClose} className="relative z-50" aria-modal="true" role="dialog">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white dark:bg-base-100 p-6 rounded-xl shadow-xl">
          <Dialog.Title className="text-lg font-bold mb-4">Update Book Status</Dialog.Title>
          <p>
            Do you want to{" "}
            <strong>{book.status === "published" ? "mark as Draft" : "Publish"}</strong>{" "}
            the book <strong>{book.title}</strong>?
          </p>

          <div className="flex justify-end gap-2 mt-6">
            <button
              className="btn"
              onClick={onClose}
              aria-label="Cancel status update"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={handleStatusUpdate}
              aria-label="Confirm status update"
              disabled={loading}
            >
              {loading ? "Updating..." : "Yes, Update"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default StatusUpdateModal;
