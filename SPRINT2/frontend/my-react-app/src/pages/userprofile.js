import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSearch from "../components/searchbar/useSearch";
import "../style/userprofile.css";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/popuppost.css";
import "../style/popupcomment.css";

const UserProfile = () => {
  const [PopupPostVisible, setPopupPostVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [username, setUsername] = useState("User profile");
  const [followers, setFollowers] = useState(0); // Alusta nykyisten seuraajien määrä
  const [following, setFollowing] = useState(0); // Alusta seurattujen määrä

  const toggleFollow = () => {
    setIsFollowing((prevState) => !prevState);
    // Päivitä seuraajien ja seurattujen määrä riippuen siitä, aloittaako käyttäjä seuraamisen vai lopettaako sen
    if (isFollowing) {
      setFollowers((prevFollowers) => prevFollowers - 1);
    } else {
      setFollowers((prevFollowers) => prevFollowers + 1);
    }
  };

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm, handleKeyPress] = useSearch('', (term) => {
    // Handle search logic here, if needed
  }, navigate);

  useEffect(() => {
    toggleFollow();
  }, []);

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

  const openPopupPost = () => {
    setPopupPostVisible(true);
  };

  const closePopupPost = () => {
    setPopupPostVisible(false);
    setSelectedImage(null);
    setSelectedText("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      const newItem = { image: selectedImage, text: selectedText };
      setSelectedImage(null);
      setSelectedText("");
      setPopupPostVisible(false);
    }
  };


  return (
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
              <a onClick={openPopupPost}>POST</a>
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
            {/* Use handleKeyPress function to trigger search on Enter key press */}
            <input type="text" placeholder="Search" onKeyPress={handleKeyPress} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="userprofile-feed">
            <div className="userprofile-info">
              <div className="userprofile-username">
                <h2>
                  {username}
                  <br />
                  <div className="userprofile-follower-following">
                    <h3>{followers} Followers </h3>
                    <h3>{following} Following</h3>
                  </div>
                  <br />
                  <p>
                    Welcome to my page
                    {/* muista lisätä div ja funktio joka hakee tiedot tietokannasta */}
                  </p>
                </h2>
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

            <div className="userprofile-details">
              <h4></h4>

              <h2 className="line2"></h2>
            </div>

            <div
              className="postpopup"
              style={{ display: PopupPostVisible ? "block" : "none" }}
            ></div>

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
            <div
              className="postpopup"
              style={{ display: PopupPostVisible ? "block" : "none" }}
            >
              <span className="closePostPopup" onClick={closePopupPost}>
                &times;
              </span>
              <div className="post-popup-content">
                <div className="content-wrapper">
                  <h2>Add a new picture</h2>
                  <div className="empty-area">
                    {selectedImage && (
                      <div className="postPicAndComment">
                        <img
                          src={selectedImage}
                          alt="Selected"
                          className="preview-image"
                        />
                        <input
                          type="text"
                          value={selectedText}
                          onChange={(e) => setSelectedText(e.target.value)}
                          placeholder="Enter your text here"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      className="file-input"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <button
                      className="post-select-button"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      Drag here or Select from computer
                    </button>
                  </div>
                </div>
                <button className="submit-button" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserProfile;
