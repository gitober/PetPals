import React, { useState } from "react";
import "../style/home.css";
import Layout from "../Layout";

function Home() {
  // State variables for like status and count
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Function to toggle like
  function toggleLike() {
    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setLiked(true);
      setLikeCount(likeCount + 1);
    }
  }

  function openPopup() {
    var popup = document.querySelector('.popup');
    popup.style.display = 'block';
  }

  function closePopup() {
    var popup = document.querySelector('.popup');
    popup.style.display = 'none';
  }
  // Function to open comment popup
  function openCommentPopup() {
    const commentPopup = document.getElementById("commentPopup");
    commentPopup.style.display = "block";
  }

  function closeCommentPopup() {
    const commentPopup = document.getElementById("commentPopup");
    commentPopup.style.display = "none";
  }

  // Function to submit comment
  function submitComment() {
  }


  return (
    <Layout>
      <div className="container">
        <div className="sidebar">
        <img srcset="/img/navbar.png" alt="logo" />
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
        <span className="closePop" onClick={() => closePopup()}> &times;</span>
        <div className="popup-content">
          <h2>Add a new picture</h2>
          <div className="empty-area">
            <div className="drag-header"></div>
            <input type="file" id="fileInput" accept="image/*" className="file-input" />
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
            <div className="user-info">
              <a href="../userprofile">
                <h3>username</h3>
              </a>
            </div>
            <div className="feed-image">
              <a href="/userprofile">
                <img srcset="/img/profiledog.jpg" alt="Feed Image" />
              </a>
            </div>
            <div className="icons">
              <div className="like-container">
                <img
                  src="../img/like.png"
                  alt="Like"
                  className="like-icon"
                  id="likeIcon"
                  onClick={() => toggleLike()}
                />
              </div>
              <img
                srcset="../img/comment.png"
                alt="Comment"
                className="icon"
                onClick={() => openCommentPopup()}
              />
            
              <div className="likes-container">
                <p className="likes">
                  likes <span id="likeCount">0</span>
                </p>
              </div>
            </div>
            <p className="lorem-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            </p>
          </div>
        </div>

        <div className="comment-popup" id="commentPopup">
          <div>
            <span className="close" onClick={() => closeCommentPopup()}>
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
            <button onClick={() => submitComment()}>Submit</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;