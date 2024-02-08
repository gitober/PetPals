import React, { useState, useEffect } from "react";
import "./login.css"; // Import CSS file

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
      window.location.href = "../home/home.html";
    }
  }

  return (
    <div className="container">
      <div className="logo-container">
        <div className="logo">
          <img src="../img/project_logo.png" alt="Logo" />
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
            <p className="signUpClose" id="signUpCloseLink">
              forgot your password?
            </p>
            <br />
            <p className="signUp" id="signUpLink">
              Don't have an account? Sign up
            </p>
          </form>
        </div>
      </div>

      {/* Popups */}
      <div id="popupClose" className="popupClose">
        <div className="popupClose-content">
          <span className="closePop" id="closePop">
            &times;
          </span>
          <h1>Forgot your password?</h1>
          <p>
            Problems signing in? <br />
            Import your email, phone number, or username <br />
            So we will send you a link to reset your password
          </p>
          <input
            type="text"
            id="emailInput"
            placeholder="Enter your email, phone number, or username"
          />
          <input type="submit" id="SubmitButton" value="Submit" />
        </div>
      </div>

      <div id="popup" className="popup">
        <div className="popup-content">
          <span className="close" id="close">
            &times;
          </span>
          <h2>Sign Up Options</h2>
          <p>
            <a href="signup_email.html">Option 1: Sign up with email</a>
          </p>
          <p>
            <a href="signup_social.html">Option 2: Sign up with social media</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
