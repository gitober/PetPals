import { useState, useEffect } from "react";

const useSignup = (apiUrl) => {
  // State Management
  const [signupFormData, setSignupFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [signupPopupVisible, setSignupPopupVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState(""); // Status message for feedback
  const [statusType, setStatusType] = useState(""); // 'success' or 'error'
  const [fieldErrors, setFieldErrors] = useState({});

  // Password Validation
  const validatePassword = (password) => {
    const criteria = [
      { test: (v) => v.length >= 8, message: "At least 8 characters." },
      { test: (v) => /[A-Z]/.test(v), message: "1 uppercase letter." },
      { test: (v) => /[a-z]/.test(v), message: "1 lowercase letter." },
      { test: (v) => /\d/.test(v), message: "1 number." },
      { test: (v) => /[!@#$%^&*(),.?\":{}|<>]/.test(v), message: "1 special character." },
    ];
    return criteria
      .filter((c) => !c.test(password))
      .map((c) => c.message)
      .join(" ");
  };

  // Username Validation (Lowercase Only)
  const validateUsername = (username) => {
    if (username !== username.toLowerCase()) {
      return "Only lowercase letters are allowed.";
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      return "Username can only contain lowercase letters, numbers, and underscores.";
    }
    return "";
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupFormData((prev) => ({ ...prev, [name]: value }));
    setStatusMessage(""); // Clear status message when user types

    if (name === "password") {
      const error = validatePassword(value);
      setFieldErrors((prev) => ({ ...prev, password: error || "" }));
    }

    if (name === "username") {
      const error = validateUsername(value);
      setFieldErrors((prev) => ({ ...prev, username: error || "" }));
    }
  };

  // Handle Blur Validation (API Check for Uniqueness)
  const handleBlur = async (e) => {
    const { name, value } = e.target;
    if (["username", "email"].includes(name)) {
      try {
        const res = await fetch(`${apiUrl}/users/check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [name]: value }),
        });
        const result = await res.json();

        if (res.ok) {
          setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        } else {
          setFieldErrors((prev) => ({ ...prev, [name]: result.error || "Invalid input." }));
          setStatusType("fieldError"); // Prevent global message duplication
          setStatusMessage("");
        }
      } catch {
        setFieldErrors((prev) => ({ ...prev, [name]: "Validation failed." }));
        setStatusType("fieldError");
        setStatusMessage("");
      }
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert username to lowercase before submission if required
    const formData = { ...signupFormData, username: signupFormData.username.toLowerCase() };

    if (fieldErrors.password) {
      setStatusMessage("Fix the form errors.");
      setStatusType("error");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage("Signup successful!");
        setStatusType("success");

        // Delay closing the popup to show the success message
        setTimeout(() => {
          setSignupPopupVisible(false); // Close the popup after a delay
        }, 3000); // Show the message for 3 seconds
      } else {
        setStatusMessage(data.message || "Signup failed.");
        setStatusType("error");
      }
    } catch {
      setStatusMessage("An unexpected error occurred.");
      setStatusType("error");
    }
  };

  // Reset Form and Errors on Popup Close
  useEffect(() => {
    if (!signupPopupVisible) {
      setSignupFormData({ username: "", email: "", password: "" });
      setFieldErrors({});
      setStatusMessage("");
      setStatusType("");
    }
  }, [signupPopupVisible]);

  return {
    signupFormData,
    signupPopupVisible,
    statusMessage,
    statusType,
    handleSignupInputChange: handleInputChange,
    handleSignupBlur: handleBlur,
    handleSignupSubmit: handleSubmit,
    fieldErrors,
    openSignupPopup: () => setSignupPopupVisible(true),
    closeSignupPopup: () => setSignupPopupVisible(false),
    setSignupFormData,
    setFieldErrors,
    setStatusMessage,
  };
};

export default useSignup;
