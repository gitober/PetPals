import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/settings.css";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/popuppost.css";
import "../style/popupcomment.css";
import Layout from "../Layout";
import { UserContext } from "./UserContext";

function Settings() {
  const [postPopupVisible, setPostPopupVisible] = useState(false);
  const { username, setUsername } = useContext(UserContext);
  const [profilePicture, setProfilePicture] = useState("../img/profiledog.jpg"); // Initialize profile picture state
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedProfilePicture = localStorage.getItem("profilePicture"); // Get saved profile picture from localStorage
    if (savedUsername) {
      setUsername(savedUsername);
    }
    if (savedProfilePicture) {
      setProfilePicture(savedProfilePicture); // Set profile picture state from localStorage
    }
  }, [setUsername]);

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const newProfilePicture = e.target.result;
        setProfilePicture(newProfilePicture); // Update profile picture state
        localStorage.setItem("profilePicture", newProfilePicture); // Save profile picture to localStorage
      };
      reader.readAsDataURL(file);
    }
  };

  const editUsername = () => {
    const newUsername = prompt("Enter your new username:", username);
    if (newUsername !== null) {
      setUsername(newUsername);
      localStorage.setItem("username", newUsername); // Save username to localStorage
      navigate("/profile");
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

  function openPostPopup() {
    setPostPopupVisible(true);
  }

  function closePostPopup() {
    setPostPopupVisible(false);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleDroppedFiles(files);
  }

  function handleDroppedFiles(files) {
    console.log(files);
  }

  return (
    <Layout>
      <div className="settings-page-container">
        <div className="sidebar">
          <img srcSet="/img/navbar.png" alt="logo" />
          <ul>
            <li>
              <a href="../home">HOME</a>
            </li>
            <li>
              <a href="../profile">PROFILE</a>
            </li>
            <li>
              <a onClick={openPostPopup}>POST</a>
            </li>
            <li>
              <a href="../settings">SETTINGS</a>
            </li>
          </ul>
          <div className="logout">
            <a href="/login">Log Out</a>
          </div>
        </div>

        <div className="settings-main-content">
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>
          <div className="settings-feed">
            <h1>Settings</h1>
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
                  src={profilePicture}
                  alt="Profile Picture"
                />
              </label>
              <div className="textbox">{username}</div>
            </div>
            <div className="row">
              <div className="setting-box">
                <label className="profiletext" htmlFor="profilePictureInput">
                  change profile picture
                </label>
              </div>

              <div className="setting-box">
                <h3 onClick={editUsername}>change username</h3>
              </div>
            </div>
            <div className="row">
              <div className="biotextdiv">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
              <div className="passtextdiv">
                <p className="passtext">new password</p>
              </div>
            </div>
            <div className="row">
              <div className="setting-box">
                <h3 onClick={editbiotext}>edit bio</h3>
              </div>
              <div className="setting-box">
                <h3 onClick={changePassword}>change password</h3>
              </div>
            </div>

            <div
              className="postpopup"
              style={{ display: postPopupVisible ? "block" : "none" }}
            >
              <span className="closePostPopup" onClick={closePostPopup}>
                &times;
              </span>
              <div className="post-popup-content1">
                <div className="content-wrapper">
                  <h2>Add a new picture</h2>
                  <div className="empty-area">
                    <div className="drag-header"></div>
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      className="file-input"
                      style={{ display: "none" }}
                    />
                    <button
                      className="post-select-button1"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      Drag here
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="post-popup-content2"
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e)}
              >
                <div className="content-wrapper">
                  <h2>Or</h2>
                  <label htmlFor="fileInput" className="post-select-button2">
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
