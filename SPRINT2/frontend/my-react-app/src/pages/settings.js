import React from "react";
import "../style/settings.css";
import Layout from "../Layout";

function Settings() {
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const newProfilePicture = e.target.result;
        document.querySelector(".dogprofilepicture").src = newProfilePicture;
      };
      reader.readAsDataURL(file);
    }
  };

  const editUsername = () => {
    const currentUsername = document.querySelector(".textbox").innerText;
    const newUsername = prompt("Enter your new username:", currentUsername);
    if (newUsername !== null) {
      document.querySelector(".textbox").innerText = newUsername;
    }
  };

  const editbiotext = () => {
    const currentBiotext = document.querySelector(".biotextdiv").innerText;
    const newBiotext = prompt("Enter your new biotext:", currentBiotext);
    if (newBiotext !== null) {
      document.querySelector(".biotextdiv").innerText = newBiotext;
    }
  };

  const changePassword = () => {
    const oldPassword = prompt("Enter your old password:");
    if (oldPassword !== null) {
      const newPassword = prompt("Enter your new password:");
      if (newPassword !== null) {
        alert("Password changed successfully!");
      }
    }
  };

  function openPopup() {
    var popup = document.querySelector(".popup");
    popup.style.display = "block";
  }

  function closePopup() {
    var popup = document.querySelector(".popup");
    popup.style.display = "none";
  }

  return (
    <Layout>
      <div className="container">
        <div className="sidebar">
          <img srcSet="/img/navbar.png" alt="logo" />
          <ul>
          <li>
            <a href="../home">
              {/* <img srcset="/img/home.png" alt="Home" /> */}
              HOME
            </a>
          </li>
          <li>
            <a href="../profile">
              {/* <img srcset="/img/profile.png" alt="Profile" /> */}
              PROFILE
            </a>
          </li>
          <li>
            <a onClick={() => openPopup()}>
              {/* <img srcset="/img/post.png" alt="POST" className="signUp" id="signUpLink" /> */}
              POST
            </a>
          </li>
          <li>
            <a href="../settings">
              {/* <img srcset="/img/settings.png" alt="Settings" /> */}
              SETTINGS
            </a>
          </li>
        </ul>
          <div className="logout">
            <a href="/login">Log Out</a>
          </div>

          <div className="popup">
            <span className="close" onClick={() => closePopup()}>
              &times;
            </span>
            <div className="popup-content">
              <h2>Add a new picture</h2>
              <div className="empty-area">
                <div className="drag-header"></div>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  className="file-input"
                />
              </div>
            </div>
            <h2>Drag Photos here</h2>
            <h3 className="popuph3">or</h3>
            <label htmlFor="fileInput" className="select-button">
              Select from computer
            </label>
          </div>
        </div>

        <div className="main-content">
          <div className="top-bar">
            <input type="text" placeholder="Search" />
          </div>
          <div className="feed">
            <h2 className="line2"></h2>
            <div className="row">
              <input
                type="file"
                id="profilePictureInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfilePictureChange}
              />
              <label htmlFor="profilePictureInput">
                <img
                  className="dogprofilepicture"
                  src="../img/profiledog.jpg"
                  alt="Profile Picture"
                />
              </label>
              <div className="textbox" onClick={editUsername}>
                new username here
              </div>
            </div>
            <div className="row">
              <div className="setting-box">
                <h3 className="profiletext">change profile picture</h3>
              </div>
              <div className="setting-box">
                <h3>change username</h3>
              </div>
            </div>
            <div className="row">
              <div className="biotextdiv" onClick={editbiotext}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
              <div className="passtextdiv" onClick={changePassword}>
                <p className="passtext">
                  old password
                  <br />
                  <br />
                  new password
                  <br />
                </p>
              </div>
            </div>
            <div className="row">
              <div className="setting-box">
                <h3>edit bio</h3>
              </div>
              <div className="setting-box">
                <h3>change password</h3>
              </div>

              <div className="popup">
                <span className="close" onClick={() => closePopup()}>
                  &times;
                </span>
                <div className="popup-content">
                  <h2>Add a new picture</h2>
                  <div className="empty-area">
                    <div className="drag-header"></div>
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      className="file-input"
                    />
                  </div>
                  <h2>Drag Photos here</h2>
                  <h3 className="popuph3">or</h3>
                  <label htmlFor="fileInput" className="select-button">
                    Select from computer
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;
