import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import "../style/login.css";
import "../style/popupforgotpassword.css";
import "../style/popupsignup.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const [loginDisabled, setLoginDisabled] = useState(true);
  const [signupPopupVisible, setSignupPopupVisible] = useState(false);
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [forgotPasswordPopupVisible, setForgotPasswordPopupVisible] =
    useState(false);

  // State variables for signup form
  const [signupFormData, setSignupFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Function to check inputs and enable/disable login button
  useEffect(() => {
    setLoginDisabled(!(username && password));
  }, [username, password]);

  // Function to load the Google Platform JavaScript library dynamically
  useEffect(() => {
    const loadGooglePlatform = async () => {
      try {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/platform.js";
        script.onload = () => {
          setGoogleApiLoaded(true);
          window.gapi.load("auth2", () => {
            window.gapi.auth2.init({
              client_id: "YOUR_GOOGLE_CLIENT_ID_HERE",
            });
          });
        };
        script.onerror = (error) => {
          console.error(
            "Error loading Google Platform JavaScript library:",
            error
          );
        };
        document.body.appendChild(script);

        // Clean up the script tag on unmount
        return () => {
          document.body.removeChild(script);
        };
      } catch (error) {
        console.error(
          "Error loading Google Platform JavaScript library:",
          error
        );
      }
    };

    loadGooglePlatform();
  }, []);

  // Function to handle Google sign in
  const handleGoogleSignIn = () => {
    if (window.gapi && window.gapi.auth2) {
      const auth2 = window.gapi.auth2.getAuthInstance();
      auth2.signIn().then((googleUser) => {
        const id_token = googleUser.getAuthResponse().id_token;
        // Send id_token to your backend for verification and user creation/login
      });
    } else {
      console.error("Google API is not loaded yet.");
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (username && password) {
      console.log("Logging in with username:", username);

      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Login successful. Access Token:", data.accessToken);
          window.location.href = "../home";
        } else {
          console.error("Login failed");
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    }
  };

const handleSignupSubmit = async (event) => {
  event.preventDefault();

  try {
    console.log("Handling signup submission");

    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: signupFormData.username,
        email: signupFormData.email,
        password: signupFormData.password,
      }),
    });

    console.log("Response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("Registration Successful!");
      console.log("User:", data.user.username);
      console.log("Access Token:", data.access_token);

      // Close and reset the signup form
      setSignupPopupVisible(false);
      setSignupUsername("");
      setSignupEmail("");
      setSignupPassword("");

      // rest of the code...
    } else {
      console.error("Registration failed");
    }
  } catch (error) {
    console.error("Error during signup:", error);
  }
};
  const handleForgotPasswordSubmit = (event) => {
    event.preventDefault();
    const emailInput = document.getElementById("forgot-email");
    const userEmail = emailInput.value;
    console.log("Forgot password for email:", userEmail);
    closeForgotPasswordPopup();
  };

  const handleSignupInputChange = (e) => {
    setSignupFormData({ ...signupFormData, [e.target.name]: e.target.value });
  };

  const openSignupPopup = () => {
    setSignupPopupVisible(true);
  };

  const closeSignupPopup = () => {
    setSignupPopupVisible(false);
  };

  const openForgotPasswordPopup = () => {
    setForgotPasswordPopupVisible(true);
  };

  const closeForgotPasswordPopup = () => {
    setForgotPasswordPopupVisible(false);
  };

  useEffect(() => {
    setLoginDisabled(!(username && password));
  }, [username, password]);

  return (
    <Layout>
      <div className="login-page-container">
        <div className="logo-container">
          <div className="logo">
            <img src="../img/navbar.png" alt="Logo" />
          </div>
        </div>
        <div className="login-container">
          <div className="login-form">
            <form onSubmit={handleLoginSubmit} id="loginForm">
              <h1 className="h1">Log in</h1>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="submit"
                id="loginButton"
                value="Submit"
                disabled={loginDisabled}
              />

              <p
                className="signUpClose"
                id="signUpCloseLink"
                onClick={openForgotPasswordPopup}
              >
                Forgot your password?
              </p>
              <br />
              <p className="signUp" id="signUpLink" onClick={openSignupPopup}>
                Don't have an account? Sign up
              </p>
            </form>
          </div>
        </div>

        <div
          className="forgot-password-popup"
          style={{ display: forgotPasswordPopupVisible ? "block" : "none" }}
        >
          <div className="forgot-password-popup-content">
            <span className="close" onClick={closeForgotPasswordPopup}>
              &times;
            </span>
            <h1>Forgot your password?</h1>
            <p>Problems signing in?</p>
            <p>Import your email</p>
            <div className="forgot-popup-content">
              <input
                type="text"
                id="forgot-email"
                placeholder="Enter your email"
                className="popup-input"
              />
              <input
                type="submit"
                id="SubmitButton"
                value="Submit"
                onClick={handleForgotPasswordSubmit}
                className="popup-submit"
              />
            </div>
          </div>
        </div>

        <div
          className="signup-popup"
          style={{ display: signupPopupVisible ? "block" : "none" }}
        >
          <div className="signup-popup-content">
            <span className="close" onClick={closeSignupPopup}>
              &times;
            </span>
            <h2>Sign Up Options</h2>
            {googleApiLoaded && (
              <button onClick={handleGoogleSignIn}>
                Sign up with Google account
              </button>
            )}
          </div>

          <div className="signup-info">
            <h3>Sign Up Information:</h3>
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="signup-username"
                  name="username"
                  placeholder="Enter username"
                  value={signupFormData.username}
                  onChange={handleSignupInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  placeholder="Enter email"
                  value={signupFormData.email}
                  onChange={handleSignupInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  placeholder="Enter password"
                  value={signupFormData.password}
                  onChange={handleSignupInputChange}
                  required
                />
              </div>
              <div className="signupinfoBtn">
                <button type="submit">Sign Up</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
