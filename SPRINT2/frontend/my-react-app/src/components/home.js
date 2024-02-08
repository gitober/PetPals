import React, { useState } from "react";
import "./home.css"; // Import CSS file

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

  // Function to open comment popup
  function openCommentPopup() {
    // Add logic to show comment popup
  }

  // Function to close comment popup
  function closeCommentPopup() {
    // Add logic to close comment popup
  }

  // Function to submit comment
  function submitComment() {
    // Add logic to handle comment submission
    // You can send the comment to the server, update the UI, etc.
    closeCommentPopup();
  }

  return (
    <div className="home-container">
      <div className="like-section">
        <img
          src={liked ? "../img/like-filled.png" : "../img/like.png"}
          alt="Like"
          id="likeIcon"
          onClick={toggleLike}
        />
        <span id="likeCount">{likeCount}</span>
      </div>
      <button onClick={openCommentPopup}>Open Comment Popup</button>
      {/* Comment Popup */}
      <div id="commentPopup" className="comment-popup">
        <div className="comment-popup-content">
          <span className="close" onClick={closeCommentPopup}>
            &times;
          </span>
          <h2 className="add-comment">Add a comment</h2>
          <textarea placeholder="Write your comment here..." />
          <button onClick={submitComment}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
