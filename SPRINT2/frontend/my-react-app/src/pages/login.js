import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import "../style/login.css";
import "../style/popupforgotpassword.css";
import "../style/popupsignup.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginDisabled, setLoginDisabled] = useState(true);
  const [signupPopupVisible, setSignupPopupVisible] = useState(false);
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [forgotPasswordPopupVisible, setForgotPasswordPopupVisible] =
    useState(false);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (username && password) {
      console.log("Logging in with username:", username);

      try {
        console.log("Password entered for login.");

        // Make an HTTP POST request to the server
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
    if (signupUsername && signupEmail && signupPassword) {
      console.log("Signup successful. Username:", signupUsername);

      try {
        // Make an HTTP POST request to the server
        const response = await fetch("http://localhost:5000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: signupUsername,
            email: signupEmail,
            password: signupPassword,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(
            "Registration successful. Access Token:",
            data.access_token
          );

          // Clear the form inputs after successful registration
          setSignupUsername("");
          setSignupEmail("");
          setSignupPassword("");

          closeSignupPopup();
        } else {
          console.error("Registration failed");
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  };

  const handleForgotPasswordSubmit = (event) => {
    event.preventDefault();
    const emailInput = document.getElementById("forgot-email");
    const userEmail = emailInput.value;
    // Perform logic for forgot password, e.g., send reset email
    console.log("Forgot password for email:", userEmail);
    closeForgotPasswordPopup();
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
    // Enable or disable the login button based on the presence of username and password
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
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="signup-username"
                  name="username"
                  placeholder="Enter username"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
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
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
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
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>
              <div className="signupinfoBtn">
                <button type="submit" onClick={handleSignupSubmit}>
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>

        <div
          className="forgot-password-popup"
          style={{
            display: forgotPasswordPopupVisible ? "block" : "none",
          }}
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
                value="Submit"
                className="popup-submit"
                onClick={handleForgotPasswordSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
