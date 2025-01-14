import { useState } from "react";

const useForgotPassword = (closeForgotPasswordPopup) => {
  // State Management
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Clear Form State
  const clearFormState = () => {
    setForgotPasswordEmail("");
    setError(null);
    setSuccessMessage(null);
  };

  // Handle Forgot Password Submission
  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();

    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    try {
      console.log("Forgot password for email:", forgotPasswordEmail);

      // API Call to Trigger Password Reset via Backend
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      // Handle API Response
      if (response.ok) {
        console.log("Password reset email sent:", data);
        setSuccessMessage("Password reset email has been sent. Please check your inbox.");
        closeForgotPasswordPopup(); // Close the popup (optional)
        clearFormState(); // Clear the form when closing
      } else {
        console.error("Error during forgot password:", data.error);
        setError(data.error || "Failed to send password reset email.");
      }
    } catch (error) {
      console.error("Error during forgot password:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      // Reset Loading State
      setLoading(false);
    }
  };

  // Reset form when closing the popup
  const handlePopupClose = () => {
    clearFormState();
    closeForgotPasswordPopup();
  };

  // Return Hook Utilities
  return {
    forgotPasswordEmail,
    setForgotPasswordEmail,
    handleForgotPasswordSubmit,
    handlePopupClose,
    loading,
    error,
    successMessage,
  };
};

export default useForgotPassword;
