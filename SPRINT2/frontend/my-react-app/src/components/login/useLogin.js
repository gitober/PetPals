import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestModeInstance } from '../../components/testmode/useTestMode';
import { UserContext } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { login as apiLogin } from '../../utils/apiauth'; 

const useLogin = (apiUrl, isTestModeLogin) => {
  const navigate = useNavigate();
  const { setUsername: setContextUsername } = useContext(UserContext);
  const { login: authLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordPopupVisible, setForgotPasswordPopupVisible] = useState(false);
  const [signupPopupVisible, setSignupPopupVisible] = useState(false);
  const [loginDisabled, setLoginDisabled] = useState(true);
  const { isTestMode } = useTestModeInstance();

  const openForgotPasswordPopup = () => {
    console.log("Opening forgot password popup");
    setForgotPasswordPopupVisible(true);
  };

  const openSignupPopup = () => {
    console.log("Opening signup popup");
    setSignupPopupVisible(true);
  };

  const closeForgotPasswordPopup = () => {
    console.log("Closing forgot password popup");
    setForgotPasswordPopupVisible(false);
  };

  const closeSignupPopup = () => {
    console.log("Closing signup popup");
    setSignupPopupVisible(false);
  };

  useEffect(() => {
    setLoginDisabled(!(username && password));
  }, [username, password]);

  const handleLoginSubmit = async (event) => {
  event.preventDefault();

  if (isTestMode && !isTestModeLogin) {
      // If in test mode and not specifically for login, allow login without credentials
      console.log("Test mode: Simulating successful login");
      navigate("/home");
      return;
    }

  if (username && password) {
    console.log("Logging in with username:", username);

    try {
      if (isTestModeLogin && isTestMode) {
        console.log("Test mode: Simulating successful login");
        navigate("/home");
      } else {
        const response = await apiLogin(username, password);
        console.log("Response from apiLogin:", response);

        if (response && response.accessToken) {
          console.log("Login successful. Access Token:", response.accessToken);

          localStorage.setItem("accessToken", response.accessToken);
          localStorage.setItem("username", username);

          setContextUsername(username);

          authLogin(response.user, response.accessToken, response.refreshToken);

          console.log("localStorage accessToken (after setting):", localStorage.getItem("accessToken"));
          console.log("localStorage username (after setting):", localStorage.getItem("username"));

          navigate("/home");

          // Introduce a delay before fetching user data
          setTimeout(async () => {
            const userResponse = await fetch(`${apiUrl}/api/user`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${response.accessToken}`,
              },
            });

            if (userResponse.ok) {
              const userData = await userResponse.json();
              console.log("User data:", userData);
            } else {
              console.error("Error fetching user data. Server responded with:", userResponse.statusText);
            }
          }, 1000); // You can adjust the delay as needed
        } else {
          console.error("Login failed. Server responded with:", response && response.message ? response.message : "Unknown error");
          console.log("Full response:", response); // Add this line for detailed response logging
        }
      }
    } catch (error) {
      console.error("Error during login:", error.message);
    }
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
  };
};

export default useLogin;
