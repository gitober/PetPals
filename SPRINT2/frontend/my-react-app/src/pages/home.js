import React, { useState } from "react";
import "../style/home.css";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/popuppost.css"; // Updated CSS file path
import "../style/popupcomment.css";
import Layout from "../Layout";

function Home() {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedText, setSelectedText] = useState(""); // Added state for selected text
  const [postPopupVisible, setPostPopupVisible] = useState(false);
  const [commentPopupVisible, setCommentPopupVisible] = useState(false);
  const [feedItems, setFeedItems] = useState([]);
  const [likeImage, setLikeImage] = useState("../img/like.png");

  function toggleLike() {
  if (liked) {
    setLikeCount((prevCount) => prevCount - 1);
    setLikeImage("../img/like.png"); // Change to outline like image
  } else {
    setLikeCount((prevCount) => prevCount + 1);
    setLikeImage("../img/like-filled.png"); // Change to filled like image
  }
  setLiked(!liked);
}

  const openPostPopup = () => {
    setPostPopupVisible(true);
  };

  const closePostPopup = () => {
    setPostPopupVisible(false);
    setSelectedImage(null); // Clear selected image when closing the popup
    setSelectedText(""); // Clear selected text when closing the popup
  };

  function openCommentPopup() {
    setCommentPopupVisible(true);
  }

  function closeCommentPopup() {
    setCommentPopupVisible(false);
  }

  // Function to submit comment
  function submitComment() {
    // Your comment submission logic goes here
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      const newItem = { image: selectedImage, text: selectedText }; // Creating a new feed item object
      setFeedItems([...feedItems, newItem]); // Add new item to feed
      setSelectedImage(null); // Clear selected image
      setSelectedText(""); // Clear selected text
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
            {feedItems.map((item, index) => (
              <div key={index} className="feed-item">
                <a href="../userprofile">
                <h3>username</h3>
                </a>  
                <img src={item.image} alt={`Feed Image ${index}`} />
                <div className="icons">
              <div className="like-container">
                <img
                  src={likeImage}
                  alt="Like"
                  className={`like-icon ${liked ? "liked" : ""}`}
                  id="likeIcon"
                  onClick={toggleLike}
                />
              </div>
              <img
                srcSet="../img/comment.png"
                alt="Comment"
                className="icon"
                onClick={openCommentPopup}
              />

              <div className="likes-container">
                <p className="likes">
                  likes <span id="likeCount">{likeCount}</span>
                </p>
              </div>
            </div>
                <p>{item.text}</p> {/* Displaying selected text */}
                
              </div>
              
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
                  <div>
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="preview-image"
                    />
                    <input
                      type="text"
                      value={selectedText}
                      onChange={(e) => setSelectedText(e.target.value)} // Updating selected text
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
          <div
          className="comment-popup"
          style={{ display: commentPopupVisible ? "block" : "none" }}
        >
          <div>
            <span className="close" onClick={closeCommentPopup}>
              &times;
            </span>
          </div>
          <div className="popUpCommentHeader">
            <h2>Comments</h2>
          </div>
          <div className="comment-popup-content"></div>
          <div className="comment-input">
            <input type="text" placeholder="Write your comment here..." />
          </div>
          <div className="submit-comment">
            <button onClick={submitComment}>Submit</button>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
