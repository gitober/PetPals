import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../../style/settings-popup.css";
import sanitizeImageUrl from "../../../utils/sanitizeImageUrl";

const FollowModal = ({ title, list, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const handleUsernameClick = (username) => {
    navigate(`/userprofile/${username}`);
  };

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Close modal on clicking outside
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  

  return (
    <div className="settings-popup-overlay">
      <div className="follow-modal-container" ref={modalRef}>
        <h2 className="follow-modal-title">{title}</h2>
        {list.length > 0 ? (
          <ul className="follow-modal-list">
            {list.map((user) => (
              <li key={user._id} className="follow-modal-item">
                <img
                  src={user.profilePicture || "/placeholder-image.png" || sanitizeImageUrl}
                  alt={`${user.username}'s profile`}
                  className="follow-modal-profile-picture"
                />
                <span
                  className="follow-modal-username"
                  onClick={() => handleUsernameClick(user.username)}
                >
                  {user.username}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="follow-modal-empty">No users found.</p>
        )}
        <button className="follow-modal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default FollowModal;
