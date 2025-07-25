import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";
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
    <Dialog open={isOpen} onClose={loading ? () => {} : onClose} className="relative z-50" aria-modal="true" role="dialog">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white dark:bg-base-100 p-6 rounded-xl shadow-xl">
          <Dialog.Title className="text-lg font-bold mb-4">Toggle Visibility</Dialog.Title>
          <p>
            Do you want to make <strong>{book.title}</strong>{" "}
            {book.isPublic ? "Private" : "Public"}?
          </p>

          <div className="flex justify-end gap-2 mt-6">
            <button
              className="btn"
              onClick={onClose}
              aria-label="Cancel visibility toggle"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-warning"
              onClick={handleToggle}
              aria-label="Confirm visibility toggle"
              disabled={loading}
            >
              {loading ? "Changing..." : "Yes, Change"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ToggleVisibilityModal;
