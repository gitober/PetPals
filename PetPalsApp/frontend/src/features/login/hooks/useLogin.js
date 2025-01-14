import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../user-context/hooks/UserContext";

const useLogin = (apiUrl) => {
  // Context and Navigation
  const navigate = useNavigate();
  const { setUsername: setContextUsername } = useContext(UserContext);

  // State Management
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordPopupVisible, setForgotPasswordPopupVisible] = useState(false);
  const [signupPopupVisible, setSignupPopupVisible] = useState(false);
  const [loginDisabled, setLoginDisabled] = useState(true);
  const [error, setError] = useState("");

  // Popup Handlers
  const openForgotPasswordPopup = () => {
    setForgotPasswordPopupVisible(true);
  };

  const openSignupPopup = () => {
    setSignupPopupVisible(true);
  };

  const closeForgotPasswordPopup = () => {
    setForgotPasswordPopupVisible(false);
  };

  const closeSignupPopup = () => {
    setSignupPopupVisible(false);
  };

  // Enable/Disable Login Button
  useEffect(() => {
    setLoginDisabled(!(username && password));
  }, [username, password]);

  // Handle Login Submission
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous errors

    try {
      const loginData = {
        username: username.trim(),
        password: password,
      };

      const loginUrl = `${apiUrl}/users/login`;
      console.log("Login URL:", loginUrl);

      const loginResponse = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const responseData = await loginResponse.json();
      console.log("Login response data:", responseData);

      if (loginResponse.ok) {
        const accessToken = responseData.accessToken;
        const userId = responseData._id;

        if (accessToken && userId) {
          console.log("Login successful. Access Token:", accessToken);

          // Store token and userId in localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("currentUserId", userId);
          localStorage.setItem("username", responseData.username);

          setContextUsername(responseData.username);

          navigate("/home");
        } else {
          throw new Error("Access token or user ID not found in response data");
        }
      } else {
        console.error("Login failed with status:", loginResponse.status);
        setError(responseData.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    loginDisabled,
    handleLoginSubmit,
    forgotPasswordPopupVisible,
    openForgotPasswordPopup,
    closeForgotPasswordPopup,
    signupPopupVisible,
    openSignupPopup,
    closeSignupPopup,
    error, // Return the error to display it in the UI
  };
};

export default useLogin;