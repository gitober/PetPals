import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import "../style/userprofile.css";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/popuppost.css";
import "../style/popupcomment.css";

const UserProfile = () => {
  const [postPopupVisible, setPostPopupVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [username, setUsername] = useState("User profile");

  const toggleFollow = () => {
    setIsFollowing((prevState) => !prevState);
  };

  const userFeedPictures = [
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
  ];

  const populateFeedPictures = () => {
    const userFeedPicturesContainer = document.querySelector(
      ".userprofile-feed-pictures-container"
    );

    userFeedPicturesContainer.innerHTML = "";

    userFeedPictures.forEach((pictureUrl) => {
      const pictureContainer = document.createElement("div");
      pictureContainer.className = "userprofile-feed-picture-container";

      const pictureElement = document.createElement("img");
      pictureElement.src = pictureUrl;
      pictureElement.alt = "Feed Picture";

      pictureContainer.appendChild(pictureElement);
      userFeedPicturesContainer.appendChild(pictureContainer);
    });
  };

  useEffect(() => {
    populateFeedPictures();
  }, []);

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
      <div className="userprofile-container">
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

        <div className="userprofile-main-content">
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>

          <div className="userprofile-feed">
            <div className="userprofile-info">
              <div className="userprofile-username">
                <h3>{username}</h3>
              </div>
              <div className="userprofile-follow-button-container">
                <button
                  id="userprofile-followButton"
                  className="userprofile-follow-button"
                  onClick={toggleFollow}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
              <div className="userprofile-profilepicture-container">
                <img
                  src="/img/profiledog.jpg"
                  alt="Profile Picture"
                  className="userprofile-profilepicture"
                />
              </div>
            </div>

              <div className="userprofile-follower-following">
                <p>100 Followers</p>
                <p>50 Following</p>
              </div>

            <div className="userprofile-details">
              <h4></h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                euismod semper libero, vitae fermentum magna elementum vel. Sed
                vestibulum lacus ut libero sagittis, id rhoncus nunc ultricies.
                In auctor est vitae nunc efficitur, vel eleifend dolor
                vestibulum.
              </p>
              <h2 className="line2"></h2>
            </div>

            <div
              className="userprofile-postpopup"
              style={{ display: postPopupVisible ? "block" : "none" }}
            >
              {/* Your post popup content goes here */}
            </div>

            <div
              className="userprofile-feed-pictures-container"
              id="userprofile-feed-pictures-container"
            >
              {userFeedPictures.map((_, index) => (
                <div className="userprofile-feed-picture-container" key={index}>
                  {/* Use a placeholder image URL or a dummy image service */}
                  <img
                    src={`https://via.placeholder.com/300`}
                    alt={`Feed Picture ${index + 1}`}
                    className="userprofile-feed-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
