import React from "react";
import useLogin from "../components/login/useLogin";
import useSignup from "../components/popups/useSignup";
import "../style/login.css";
import "../style/popupforgotpassword.css";
import "../style/popupsignup.css";
import { useTestModeInstance } from '../components/testmode/useTestMode';

function Login() {
  const { simulateTestMode } = useTestModeInstance(); // eslint-disable-line no-unused-vars

  const apiUrl = "http://localhost:5000";

  // Manually set isTestModeLogin for testing purposes
  const isTestModeLogin = false;

  // Use the useLogin hook for login form
  const {
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
  } = useLogin(apiUrl, isTestModeLogin);

  // Use the useSignup hook for signup form
  const {
    handleSignupSubmit,
    signupFormData,
    handleSignupInputChange,
    handleForgotPasswordSubmit,
  } = useSignup(apiUrl);

  return (
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
              id="loginUsername"  // Unique id
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
            <h2>Sign Up Information:</h2>
          </div>

          <div className="signup-info">
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Username"
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
  );
}

export default Login;