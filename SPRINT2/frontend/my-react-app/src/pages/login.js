import React, { useState, useEffect } from "react";
import "../style/login.css";
import "../style/popupforgotpassword.css";
import "../style/popupsignup.css";
import Layout from "../Layout";

function Login() {
  // State variables for inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State variable for login button disabled status
  const [loginDisabled, setLoginDisabled] = useState(true);

  const [signupPopupVisible, setsignupPopupVisible] = useState(false);
  const [forgotPasswordPopupVisible, setForgotPasswordPopupVisible] =
    useState(false);

  // Function to check inputs and enable/disable login button
  useEffect(() => {
    setLoginDisabled(!(username && password));
  }, [username, password]);

  // Function to handle form submission
  function handleSubmit(event) {
    event.preventDefault(); // Prevent form submission

    // Simulate login logic
    if (username && password) {
      // Redirect to home page
      window.location.href = "../home";
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
            <form onSubmit={handleSubmit} id="loginForm">
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
              Import your email, phone number, or username to reset your
              password
            </p>
            <div className="forgot-popup-content">
              <input
                type="text"
                id="emailInput"
                placeholder="Enter your email, phone number, or username"
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
              <a href="signup_email.html">Sign up with Google account</a>
            </p>
          </div>

          <div className="signup-info">
            <h3>Sign Up Information:</h3>
            <form>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="signup-username"
                  name="username"
                  placeholder="Enter username"
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
                  required
                />
              </div>
            </form>
          </div>
          <div className="signupinfoBtn">
            <button type="submit">Sign Up</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
