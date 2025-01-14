import React, { useState, useEffect, useRef } from "react";

const SignupPopup = ({
  signupPopupVisible,
  closeSignupPopup,
  signupFormData,
  handleSignupInputChange,
  handleSignupBlur,
  handleSignupSubmit,
  statusMessage,
  statusType,
  fieldErrors,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const modalRef = useRef(null);

  // Prevent background scrolling
  useEffect(() => {
    if (signupPopupVisible) {
      document.body.style.overflow = "hidden"; // Disable background scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable background scrolling
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [signupPopupVisible]);

  // Close modal on clicking outside
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeSignupPopup();
    }
  };

  useEffect(() => {
    if (signupPopupVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [signupPopupVisible]);

  if (!signupPopupVisible) return null;

  return (
    signupPopupVisible && (
      <div className="signup-popup-overlay">
        <div className="signup-popup" ref={modalRef}>
          <div className="signup-popup-content">
            {/* Close Button */}
            <button
              type="button"
              className="signup-close-btn"
              onClick={closeSignupPopup}
              aria-label="Close signup popup"
            >
              &times;
            </button>

            {/* Header */}
            <h2 className="signup-header">Sign Up</h2>

            {/* Form */}
            <form onSubmit={handleSignupSubmit} className="signup-form" noValidate>
              {/* Username */}
              <div className="signup-form-group">
                <label htmlFor="signup-username" className="signup-label">
                  Username:
                </label>
                <input
                  type="text"
                  name="username"
                  id="signup-username"
                  placeholder="Username"
                  value={signupFormData.username}
                  onChange={handleSignupInputChange}
                  onBlur={handleSignupBlur}
                  className={`signup-input signup-username-input ${fieldErrors.username ? "input-error" : ""
                    }`}
                  aria-invalid={!!fieldErrors.username}
                  required
                />
                {fieldErrors.username && (
                  <p className="signup-error-message">{fieldErrors.username}</p>
                )}
              </div>

              {/* Email */}
              <div className="signup-form-group">
                <label htmlFor="signup-email" className="signup-label">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  id="signup-email"
                  placeholder="Enter email"
                  value={signupFormData.email}
                  onChange={handleSignupInputChange}
                  onBlur={handleSignupBlur}
                  className={`signup-input signup-email-input ${fieldErrors.email ? "input-error" : ""
                    }`}
                  aria-invalid={!!fieldErrors.email}
                  required
                />
                {fieldErrors.email && (
                  <p className="signup-error-message">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="signup-form-group">
                <label htmlFor="signup-password" className="signup-label">
                  Password:
                </label>
                <div className="signup-password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="signup-password"
                    placeholder="Enter password"
                    value={signupFormData.password}
                    onChange={handleSignupInputChange}
                    className={`signup-input signup-password-input ${fieldErrors.password ? "input-error" : ""
                      }`}
                    aria-invalid={!!fieldErrors.password}
                    required
                  />
                  <button
                    type="button"
                    className="signup-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <i className="fas fa-eye-slash"></i>
                    ) : (
                      <i className="fas fa-eye"></i>
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="signup-error-message">{fieldErrors.password}</p>
                )}
              </div>

              {/* Status Message (for global errors only) */}
              <div className="signup-status-container">
                {statusMessage && statusType !== "fieldError" && (
                  <p
                    className={`signup-status ${statusType === "success" ? "signup-success" : "signup-error"
                      }`}
                  >
                    {statusMessage}
                  </p>
                )}
              </div>


              {/* Submit Button */}
              <button type="submit" className="signup-submit-btn">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default SignupPopup;
