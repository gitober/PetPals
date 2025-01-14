import React, { useEffect } from "react";
import "../../../style/delete-modal.css";

const DeleteModal = ({ isVisible, onClose, onConfirm, title, description }) => {
  if (!isVisible) return null;

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose(); // Close modal on Escape
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="delete-modal">
      <div
        className="delete-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h3 id="modal-title">{title || "Confirm Deletion"}</h3>
        <p>{description || "Are you sure you want to delete this? This cannot be undone."}</p>
        <div className="delete-modal-actions">
          <button onClick={onConfirm} className="confirm-button">
            Delete
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
