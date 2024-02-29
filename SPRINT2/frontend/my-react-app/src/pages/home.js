import React, { useState } from "react";
import "../style/home.css";
import "../style/popuppost.css"; // Updated CSS file path
import Layout from "../Layout";

function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [postPopupVisible, setPostPopupVisible] = useState(false);
  const [feedImages, setFeedImages] = useState([]);

  const openPostPopup = () => {
    setPostPopupVisible(true);
  };

  const closePostPopup = () => {
    setPostPopupVisible(false);
    setSelectedImage(null); // Clear selected image when closing the popup
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      setFeedImages([...feedImages, selectedImage]); // Add selected image to feed
      setSelectedImage(null); // Clear selected image
      setPostPopupVisible(false); // Close popup
    }
  };

  return (
    <Layout>
      <div className="home-page-container">
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
        <div className="home-main-content">
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>
          <div className="home-feed">
            {feedImages.map((image, index) => (
              <img key={index} src={image} alt={`Feed Image ${index}`} />
            ))}
          </div>
        </div>
        <div
          className="postpopup"
          style={{ display: postPopupVisible ? "block" : "none" }}
        >
          <span className="closePostPopup" onClick={closePostPopup}>
            &times;
          </span>
          <div className="post-popup-content">
            <div className="content-wrapper">
              <h2>Add a new picture</h2>
              <div className="empty-area">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="preview-image"
                  />
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
                  onClick={() => document.getElementById("fileInput").click()}
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
    </Layout>
  );
}

export default Home;
