import React, { useState } from "react";
import "../style/home.css";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/popuppost.css";
import "../style/popupcomment.css"; // Added CSS file path
import Layout from "../Layout";

function Home() {
  const [feedItems, setFeedItems] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [postPopupVisible, setPostPopupVisible] = useState(false);
  const [commentPopupVisible, setCommentPopupVisible] = useState(false);

  const toggleLike = (imageUrl) => {
  if (likeCounts[imageUrl]) {
    // If already liked, remove the like
    setLikeCounts((prevCounts) => ({
      ...prevCounts,
      [imageUrl]: 0,
    }));
  } else {
    // If not liked, add the like
    setLikeCounts((prevCounts) => ({
      ...prevCounts,
      [imageUrl]: 1,
    }));
  }
  setSelectedImage(imageUrl); // Update the selectedImage state
};

  const openPostPopup = () => {
    setPostPopupVisible(true);
  };

  const closePostPopup = () => {
    setPostPopupVisible(false);
    setSelectedImage(null);
    setSelectedText("");
  };

  const openCommentPopup = (imageUrl) => {
    setSelectedImage(imageUrl);
    setCommentPopupVisible(true);
  };

  const closeCommentPopup = () => {
    setCommentPopupVisible(false);
  };

  const submitComment = () => {
    if (selectedImage) {
      const updatedFeedItems = feedItems.map((item) => {
        if (item.image === selectedImage) {
          return {
            ...item,
            comments: [...(item.comments || []), selectedText],
          };
        }
        return item;
      });
      setFeedItems(updatedFeedItems);
      setSelectedText("");
    }
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
      setFeedItems([...feedItems, newItem]);
      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        [selectedImage]: 0, // Initialize like count for the new image
      }));
      setSelectedImage(null);
      setSelectedText("");
      setPostPopupVisible(false);
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
                      src="../img/like.png"
                      alt="Like"
                      className="like-icon"
                      id={`likeIcon-${index}`}
                      onClick={() => toggleLike(item.image)}
                    />
                  </div>
                  <img
                    src="../img/comment.png"
                    alt="Comment"
                    className="icon"
                    onClick={() => openCommentPopup(item.image)}
                  />
                  <div className="likes-container">
                    <p className="likes">
                      likes{" "}
                      <span id={`likeCount-${index}`}>
                        {likeCounts[item.image] || 0}
                      </span>
                    </p>
                  </div>
                </div>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
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
      <div
        className="comment-popup"
        style={{ display: commentPopupVisible ? "block" : "none" }}
      >
        <div>
          <span className="close" onClick={closeCommentPopup}>
            &times;
          </span>
        </div>
        <div className="preview-image-container">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected"
              className="preview-image"
            />
          )}
        </div>
        <div className="popUpCommentHeader">
          <h2>Comments</h2>
        </div>
        <div className="comment-popup-content">
          {/* Comments will be displayed here */}
          {feedItems
            .filter((item) => item.image === selectedImage)
            .map((item, index) => (
              <div key={index} className="comment">
                {item.comments &&
                  item.comments.map((comment, idx) => (
                    <div key={idx}>{comment}</div>
                  ))}
              </div>
            ))}
        </div>
        <div className="comment-input">
          <input
            type="text"
            placeholder="Write your comment here..."
            value={selectedText}
            onChange={(e) => setSelectedText(e.target.value)}
          />
        </div>
        <div className="submit-comment">
          <button onClick={submitComment}>Submit</button>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
