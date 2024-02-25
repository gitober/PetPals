import React, { useEffect, useState } from "react";
import "../style/settings.css";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/popuppost.css";
import "../style/popupcomment.css";
import Layout from "../Layout";

function Settings() {
  const [postPopupVisible, setPostPopupVisible] = useState(false);
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

  // Function to open and close post popup
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
    // Handle the dropped files, you can upload them or perform other actions
    console.log(files);
    // Update the UI or trigger any other logic

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
                  src="../img/profiledog.jpg"
                  alt="Profile Picture"
                />
              </label>
              <div className="textbox">
                new username here
              </div>
            </div>
            <div className="row">
              <div className="setting-box">
                <h3 className="profiletext" >change profile picture</h3>
              </div>
              <div className="setting-box">
                <h3  onClick={editUsername}>change username</h3>
              </div>
            </div>
            <div className="row">
              <div className="biotextdiv">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              </div>
              <div className="passtextdiv">
                <p className="passtext">
                  new password
                </p>
              </div>
            </div>
            <div className="row">
              <div className="setting-box">
                <h3  onClick={editbiotext}>edit bio</h3>
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
            {/* Post popup content 1 */}
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
                  <button className="post-select-button1"
                    onClick={() => document.getElementById("fileInput").click()}>
                    Drag here</button>
                </div>
              </div>
              </div>
                        
              <div className="post-popup-content2"
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
