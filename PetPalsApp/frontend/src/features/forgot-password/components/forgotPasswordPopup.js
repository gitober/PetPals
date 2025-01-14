import React, { useEffect, useRef } from "react";
import useForgotPassword from "../hooks/useForgotPassword";
import "../../../style/forgot-password-popup.css";

const ForgotPassword = ({ isVisible, closePopup }) => {
  const {
    forgotPasswordEmail,
    setForgotPasswordEmail,
    handleForgotPasswordSubmit,
    handlePopupClose,
    loading,
    error,
    successMessage,
  } = useForgotPassword(closePopup);

  const modalRef = useRef(null);

  // UseEffect for toggling background scrolling
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden"; // Disable background scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable background scrolling
    }

    // Cleanup to restore scrolling on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  // Close modal on clicking outside
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closePopup();
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isVisible]);

  if (!isVisible) return null; // Don't render if not visible

  return (
    <div className="forgot-password-popup-overlay">
      <div className="forgot-password-popup" ref={modalRef}>
        <span className="forgot-password-popup-close" onClick={handlePopupClose}>
          &times;
        </span>
        <h1>Forgot your password?</h1>
        <p>Problems signing in? Enter your email to reset your password.</p>
        <div className="forgot-password-popup-form-container">
          <form onSubmit={handleForgotPasswordSubmit}>
            <input
              type="email"
              id="forgot-email"
              placeholder="Enter your email"
              className="forgot-password-popup-input"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              required
            />
            <button
              id="SubmitButton"
              className="forgot-password-popup-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>

          {/* Error Message */}
          {error && <p className="forgot-password-popup-error">{error}</p>}

          {/* Success Message */}
          {successMessage && <p className="forgot-password-popup-success">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
