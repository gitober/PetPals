import React, { useEffect, useState } from "react";
import "../style/userprofile.css";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/popuppost.css";
import "../style/popupcomment.css";
import Layout from "../Layout";

const UserProfile = () => {
  const [postPopupVisible, setPostPopupVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [username, setUsername] = useState("YourUsername"); // Set a default or fetch it from your data

  const toggleFollow = () => {
    setIsFollowing((prevState) => !prevState);
  };

  // Simulated data (replace this with actual data from your application)
  const userPictures = [
    "/img/profiledog.jpg",
    "/img/profiledog.jpg",
    "/img/profiledog.jpg",
    "/img/profiledog.jpg",
    "/img/profiledog.jpg",
    "/img/profiledog.jpg",
    "/img/profiledog.jpg",
    "/img/profiledog.jpg",
    // Add more picture URLs as needed
  ];

  // Function to dynamically populate the picture containers
  const populatePictures = () => {
    const userPicturesContainer = document.getElementById(
      "user-pictures-container"
    );

    // Clear existing content
    userPicturesContainer.innerHTML = "";

    // Iterate through user pictures and create a container for each picture
    userPictures.forEach((pictureUrl) => {
      const pictureContainer = document.createElement("div");
      pictureContainer.className = "picture-container";

      const pictureElement = document.createElement("img");
      pictureElement.src = pictureUrl;
      pictureElement.alt = "User Picture";

      pictureContainer.appendChild(pictureElement);
      userPicturesContainer.appendChild(pictureContainer);
    });
  };

  // Call the function to populate pictures when the component mounts
  useEffect(() => {
    populatePictures();
  }, []);

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
      <div className="user-profile-container">
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
        {/* Main Content */}
        <div className="user-profile-main-content">
          {/* Search Bar */}
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>

          {/* User Profile Feed */}
          <div className="user-profile-feed">
            {/* User Info */}
            <div className="user-info">
              <div className="username">
                <h3>username</h3>
              </div>
              <img
                src="/img/profiledog.jpg"
                alt="Profile Picture"
                className="profile-picture"
              />
            </div>

            {/* Follower/Following Button */}
            <div className="follower-following">
              <button
                id="followButton"
                className="follow-button"
                onClick={toggleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>

            {/* Profile Details */}
            <div className="profile-details">
              <h4>Profile Details</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                euismod semper libero, vitae fermentum magna elementum vel. Sed
                vestibulum lacus ut libero sagittis, id rhoncus nunc ultricies.
                In auctor est vitae nunc efficitur, vel eleifend dolor
                vestibulum.
              </p>
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

            {/* JSX Structure */}
            <div
              className="user-pictures-container"
              id="user-pictures-container"
            >
              {/* Pictures will be dynamically added here */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
