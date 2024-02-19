import React, { useState, useEffect } from "react";
import "../style/login.css";
import Layout from "../Layout";

function Login() {
  // State variables for inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State variable for login button disabled status
  const [loginDisabled, setLoginDisabled] = useState(true);

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

  // Function to show forgot password popup
  function showForgotPasswordPopup() {
    document.getElementById("popupClose").style.display = "block";
  }

  // Function to show sign up popup
  function showSignUpPopup() {
    document.getElementById("popup").style.display = "block";
  }

  // Function to close popups
  function closePopups() {
    document.getElementById("popupClose").style.display = "none";
    document.getElementById("popup").style.display = "none";
  }

  return (
    <Layout>
    <div className="container">
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
            <p className="signUpClose" id="signUpCloseLink" onClick={showForgotPasswordPopup}>
              forgot your password?
            </p>
            <br />
            <p className="signUp" id="signUpLink" onClick={showSignUpPopup}>
              Don't have an account? Sign up
            </p>
          </form>
        </div>
      </div>

      {/* Popups */}
      <div id="popupClose" className="popupClose">
        <div className="popupClose-content">
          <span className="closePop" id="closePop" onClick={closePopups}>
            &times;
          </span>
          <h1>Forgot your password?</h1>
          <p>
            Problems signing in? <br />
            Import your email, phone number, or username <br />
            to reset your password.
          </p>
          <input
            type="text"
            id="emailInput"
            placeholder="Enter your email, phone number, or username"
          />
          <input type="submit" id="SubmitButton" value="Submit"/>
        </div>
      </div>

      <div id="popup" className="popup">
        <div className="popup-content">
        <span className="close" id="close" onClick={closePopups}>
          &times;
        </span>
        <h2>Sign Up Options</h2>
        <p>
          <a href="signup_email.html">Option 1: Sign up with email</a>
          <a href="signup_social.html">Option 2: Sign up with social media</a>
        </p>
        </div>

          <div className="signup-info">
            <h3>Sign Up Information:</h3>
            <form>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" placeholder="Enter username" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Enter email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter password" required />
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
