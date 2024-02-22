import React, { useState } from "react";
import "../style/home.css";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/popuppost.css";
import "../style/popupcomment.css";
import Layout from "../Layout";

function Home() {
  // State variables for like status and count
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [postPopupVisible, setPostPopupVisible] = useState(false);
  const [commentPopupVisible, setCommentPopupVisible] = useState(false);
  

  function toggleLike() {
    if (liked) {
      setLikeCount((prevCount) => prevCount - 1); // Decrease like count if unliking
    } else {
      setLikeCount((prevCount) => prevCount + 1); // Increase like count if liking
    }
    setLiked(!liked); // Toggle like status
  }

  // Function to open and close post popup
  function openPostPopup() {
    setPostPopupVisible(true);
  }

  function closePostPopup() {
    setPostPopupVisible(false);
  }

  // Function to open and close comment popup
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
            <div className="user-info">
              <a href="../userprofile">
                <h3>username</h3>
              </a>
            </div>
            <div className="home-feed-image">
              <a href="/userprofile">
                <img srcSet="/img/profiledog.jpg" alt="Feed Image" />
              </a>
            </div>
            <div className="icons">
              <div className="like-container">
                <img
                  src="../img/like.png"
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
            <p className="lorem-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
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
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Select from computer
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
              <h2>Drag Photos here</h2>
              <label htmlFor="fileInput" className="post-select-button2">
                Drag here
              </label>
            </div>
          </div>
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
            <h2>Add your comment</h2>
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
    </Layout>
  );
}

export default Home;
