import React, { useEffect, useState, useRef } from "react";
import useSettings from "../../settings/hooks/useSettings";
import "../../../style/settings-popup.css";

const ChangePasswordPopup = ({ onSave, onClose }) => {
  const { validateCurrentPassword } = useSettings();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const modalRef = useRef(null);

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

  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage("");

    if (!oldPassword) {
      setErrorMessage("Old password is required.");
      setIsSubmitting(false);
      return;
    }

    const validation = await validateCurrentPassword(oldPassword);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || "Old password does not match.");
      setIsSubmitting(false);
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      setIsSubmitting(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    const isValid = await onSave(oldPassword, newPassword);
    if (isValid) {
      setSuccessMessage("Password updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1500);
    } else {
      setErrorMessage("Failed to update password. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="settings-popup-overlay">
      <div className="settings-popup-container" ref={modalRef}>
        <h2>Change Password</h2>

        <div className="settings-input-container">
          <label>Old Password</label>
          <div className="password-input-wrapper">
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setErrorMessage("");
              }}
              className={`settings-input ${errorMessage.includes("Old password") ? "input-error" : ""}`}
            />
            <button
              type="button"
              className="toggle-password-visibility"
              onClick={() => setShowOldPassword(!showOldPassword)}
              aria-label={showOldPassword ? "Hide password" : "Show password"}
            >
              {showOldPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
            </button>
          </div>
        </div>

        <div className="settings-input-container">
          <label>New Password</label>
          <div className="password-input-wrapper">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrorMessage("");
              }}
              className="settings-input"
            />
            <button
              type="button"
              className="toggle-password-visibility"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
            </button>
          </div>
        </div>

        <div className="settings-input-container">
          <label>Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrorMessage("");
              }}
              className="settings-input"
            />
            <button
              type="button"
              className="toggle-password-visibility"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
            </button>
          </div>
        </div>

        {errorMessage && <p className="settings-error-message">{errorMessage}</p>}
        {successMessage && <p className="settings-success-message">{successMessage}</p>}

        <div className="settings-popup-buttons">
          <button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;
