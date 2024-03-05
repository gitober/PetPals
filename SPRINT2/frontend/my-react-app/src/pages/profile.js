import React, { useContext, useState, useEffect } from "react";
import Layout from "../Layout";
import "../style/profile.css";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/popuppost.css";
import "../style/popupcomment.css";
import { UserContext } from "./UserContext";


const Profile = () => {
  const [postPopupVisible, setPostPopupVisible] = useState(false);
  const [followers] = useState(0); // Alusta nykyisten seuraajien määrä
  const [following] = useState(0); // Alusta seurattujen määrä
  const { username, profilePicture } = useContext(UserContext); // Get username and profile picture from UserContext

  const ProfilePictures = [
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
  ];

  useEffect(() => {
    populatePictures();
  }, []);

  const populatePictures = () => {
    const ProfilePicturesContainer = document.getElementById(
      "profilepage-feed-pictures-container"
    );

    if (ProfilePicturesContainer) {
      ProfilePicturesContainer.innerHTML = "";

      // Iterate through Profile pictures and create container for each picture
      ProfilePictures.forEach((pictureUrl) => {
        const profilepagepictureContainer = document.createElement("div");
        profilepagepictureContainer.className =
          "profilepage-feed-picture-container";

        const profilepagepictureElement = document.createElement("img");
        profilepagepictureElement.src = pictureUrl;
        profilepagepictureElement.alt = "Profile Picture";

        profilepagepictureContainer.appendChild(profilepagepictureElement);
        ProfilePicturesContainer.appendChild(profilepagepictureContainer);
      });
    } else {
      console.error("Profile pictures container not found");
    }
  };

  const openPostPopup = () => {
    setPostPopupVisible(true);
  };

  const closePostPopup = () => {
    setPostPopupVisible(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleDroppedFiles(files);
  };

  const handleDroppedFiles = (files) => {
    console.log(files);
  };

  return (
    <Layout>
      <div className="profile-page-container">
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

        <div className="profile-page-main-content">
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>

          <div className="profile-page-feed">
            <div className="profilepage-info">
              <div className="profilepage-username">
                <h2>
                  {username}
                  <br />
                  <div className="profilepage-follower-following">
                    <h3>{followers} Followers </h3>
                    <h3>{following} Following</h3>
                  </div>
                  <p>
                    Welcome to my page
                    {/* muista lisätä div ja funktio joka hakee tiedot tietokannasta */}
                  </p>
                </h2>
              </div>

              <div className="profilepage-profilepicture-container">
                <img
                  src={profilePicture}
                  alt="profilepage Picture"
                  className="profilepage-profilepicture"
                />
              </div>
            </div>

            <div className="profilepage-details">
              <h4></h4>
              <h2 className="line2"></h2>
            </div>

            <div
              className="postpopup"
              style={{ display: postPopupVisible ? "block" : "none" }}
            >
              {/* Content of post popup */}
            </div>

            <div
              className="profilepage-feed-pictures-container"
              id="profilepage-feed-pictures-container"
            >
              {ProfilePictures.map((pictureUrl, index) => (
                <div className="profilepage-feed-picture-container" key={index}>
                  <img
                    src={pictureUrl}
                    alt={`Feed Picture ${index + 1}`}
                    className="profilepage-feed-image"
                  />
                </div>
              ))}
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
};

export default Profile;
