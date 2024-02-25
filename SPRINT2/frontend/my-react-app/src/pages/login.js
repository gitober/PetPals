import React, { useState, useEffect } from "react";
import "../style/login.css";
import "../style/popupforgotpassword.css";
import "../style/popupsignup.css";
import Layout from "../Layout";

function Login() {
  // State variables for inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false); // State variable to track if Google API is loaded

  // State variable for login button disabled status
  const [loginDisabled, setLoginDisabled] = useState(true);

  const [signupPopupVisible, setsignupPopupVisible] = useState(false);
  const [forgotPasswordPopupVisible, setForgotPasswordPopupVisible] =
    useState(false);

  // State variables for signup form
  const [signupFormData, setSignupFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  // Function to check inputs and enable/disable login button
  useEffect(() => {
    setLoginDisabled(!(username && password));
  }, [username, password]);

  // Function to load the Google Platform JavaScript library dynamically
  useEffect(() => {
    console.log("Loading Google Platform JavaScript library...");
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js";
    script.onload = () => {
      console.log("Google Platform JavaScript library loaded successfully.");
      setGoogleApiLoaded(true); // Setting googleApiLoaded to true when the Google API is loaded
      // Initialize the Google Sign-In client with your client ID
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: 'YOUR_GOOGLE_CLIENT_ID_HERE',
        });
      });
    };
    script.onerror = (error) => {
      console.error("Error loading Google Platform JavaScript library:", error);
    };
    document.body.appendChild(script);
  
    // Clean up the script tag on unmount
    return () => {
      console.log("Removing Google Platform JavaScript library script tag...");
      document.body.removeChild(script);
    };
  }, []);

  // Function to handle Google sign in
  const handleGoogleSignIn = () => {
    if (window.gapi && window.gapi.auth2) {
      const auth2 = window.gapi.auth2.getAuthInstance();
      auth2.signIn().then(googleUser => {
        const id_token = googleUser.getAuthResponse().id_token;
        // Send id_token to your backend for verification and user creation/login
      });
    } else {
      console.error("Google API is not loaded yet."); // Log an error if Google API is not loaded
    }
  };

  // Function to handle login form submission
  function handleLoginSubmit(event) {
    event.preventDefault(); // Prevent form submission
    // Simulate login logic
    if (username && password) {
      // Redirect to home page
      window.location.href = "../home";
    }
  }

  // Function to handle signup form submission
  async function handleSignupSubmit(event) {
    event.preventDefault(); // Prevent form submission
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupFormData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data); // Log the response from the backend
      // Optionally, you can reset the signup form here
      setSignupFormData({
        username: "",
        email: "",
        password: ""
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error signing up. Please try again.'); // Display an alert if there's an error during signup
    }
  }

  function openForgotPasswordPopup() {
    setForgotPasswordPopupVisible(true);
  }

  function closeForgotPasswordPopup() {
    setForgotPasswordPopupVisible(false);
  }

  function openSignupPopup() {
    setsignupPopupVisible(true);
  }

  function closeSignupPopup() {
    setsignupPopupVisible(false);
  }

  // Function to handle input change in signup form
  const handleSignupInputChange = (e) => {
    setSignupFormData({ ...signupFormData, [e.target.name]: e.target.value });
  };

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
            {/* Add text here */}
            <p>Problems signing in?</p>
            <p>
              Import your email
            </p>
            <div className="forgot-popup-content">
              <input
                type="text"
                id="emailInput"
                placeholder="Enter your email"
                className="popup-input"
              />
              <input
                type="submit"
                id="SubmitButton"
                value="Submit"
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
            <p>
              {/* Add Google Sign-In button */}
              {googleApiLoaded && (
                <button onClick={handleGoogleSignIn}>Sign up with Google account</button>
              )}
            </p>
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
