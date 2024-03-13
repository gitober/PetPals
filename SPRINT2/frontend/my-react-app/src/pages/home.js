import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearch from '../components/searchbar/useSearch';
import usePopupPost from '../components/popups/usePopupPost';
import usePopupComment from '../components/popups/usePopupComment';
import useLikes from '../components/likes/useLikes';
import popupPostFunctions from '../components/popups/usePopupPost';
import '../style/home.css';
import '../style/searchbar.css';
import '../style/sidebar.css';
import '../style/popuppost.css';
import '../style/popupcomment.css';

function Home() {
  // State variables
  const [feedItems, setFeedItems] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likedImages, setLikedImages] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [commentSelectedText, setCommentSelectedText] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [likesTestModeVisible, setLikesTestModeVisible] = useState(true);

  // Local Variables and Constants
  const apiUrl = "http://localhost:5000";
  const navigate = useNavigate();

  // Custom Hooks
const { likeCounts: likesData, likedImages: likedImagesData, toggleLike } = useLikes();
const [postSelectedImages, setPostSelectedImages] = useState([]);
const { comments, submitting: popupCommentSubmitting, setSelectedText: setPopupCommentSelectedText, submitComment, openPopupComment, closePopupComment, popupCommentVisible, setCurrentImage, currentImage } = usePopupComment({ commentsUrl: '/api/comments/comment', access_token: accessToken }); // Pass accessToken here
const [searchTerm, setSearchTerm, handleKeyPress] = useSearch('', (term) => {}, navigate);
const { popupPostVisible, openPopupPost, closePopupPost, handleSubmit, handleFileChange, selectedImages: popupPostSelectedImages, submitting: postSubmitting } = usePopupPost(setFeedItems);


  // Fetch access token from localStorage and set it
  useEffect(() => {
  const fetchedAccessToken = localStorage.getItem('accessToken');
  console.log('Fetched access token:', fetchedAccessToken); // Log the access token
  if (!fetchedAccessToken) {
    console.error('Access token is missing. Redirecting to login page.');
    navigate('/login');
    return;
  }
  setAccessToken(fetchedAccessToken);
}, [navigate]);

  // Fetch home feed posts
  const fetchHomeFeedPosts = useCallback(async () => {
    try {
      if (!accessToken) {
        console.error('Access token is missing. Redirecting to login page.');
        navigate('/login');
        return;
      }
      const url = `${apiUrl}/api/posts/posts`;
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await fetch(url, config);
      if (response.ok) {
        const responseData = await response.json();
        if (Array.isArray(responseData)) {
        setFeedItems(responseData);
        } else {
        console.error('Invalid response format. Expected an array of posts. Received:', responseData);
      }
      } else {
        console.error('Failed to fetch posts:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error during initial post fetch:', error.message);
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    if (accessToken) { // Ensure accessToken is not null before fetching posts
      fetchHomeFeedPosts();
    }
  }, [accessToken, fetchHomeFeedPosts]);

  // Update like counts when likes data is available
  useEffect(() => {
    if (likesTestModeVisible && likeCounts && Object.keys(likeCounts).length > 0) {
      setLikesTestModeVisible(false);
    }
  }, [likesTestModeVisible, likeCounts]);

  // Update liked images when data is available
  useEffect(() => {
    if (likedImages && likedImages.length > 0) {
      setLikedImages(likedImages);
    }
  }, [likedImages]);

  // Event handler for text input change
  const handleChange = (e) => {
    setSelectedText(e.target.value);
    console.log('selectedText updated:', e.target.value);
  };

  return (
    <div>
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
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a onClick={openPopupPost}>POST</a>
            </li>
            <li>
              <a href="../settings">SETTINGS</a>
            </li>
          </ul>
          <div className="logout">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a onClick={() => window.location.href = "/login"}>Log Out</a>
          </div>
        </div>
        <div className="home-main-content">
          <div className="search-bar">
            {/* Use handleKeyPress function to trigger search on Enter key press */}
            <input type="text" placeholder="Search" onKeyPress={handleKeyPress} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          <div className="home-feed">
            {feedItems.map((item, index) => (
  <div key={index} className="feed-item">
    <a href="../userprofile">
      <h3>username</h3>
    </a>
    <img src={item.images[0]} alt={`User's Post ${index}`} />
    <div className="icons">
      <div className="like-container">
        {/* Like icon */}
        {likedImages[item.images[0]] ? (
          <img
            src="../img/liked.png"
            alt="Image Liked"
            className="like-icon"
            id={`likeIcon-${index}`}
            onClick={() => {
              toggleLike(item.images[0]);
            }}
          />
        ) : (
          <img
            src="../img/like.png"
            alt="Image Not Liked"
            className="like-icon"
            id={`likeIcon-${index}`}
            onClick={() => toggleLike(item.images[0], item.postId)}
          />
        )}
      </div>
      {/* Comment icon */}
      <img
        src="../img/comment.png"
        alt="Image"
        className="icon"
        onClick={() => openPopupComment(item.images[0])}
      />
      <div className="likes-container">
        {/* Display like count */}
        <p className="likes">
          likes{" "}
          <span id={`likeCount-${index}`}>
            {likeCounts[item.images[0]] !== undefined
              ? likeCounts[item.images[0]]
              : 0}
          </span>
        </p>
      </div>
    </div>
    <p>{item.content}</p>
  </div>
))}
          </div>
        </div>
      </div>
      <div
        className="postpopup"
        style={{ display: popupPostVisible ? "block" : "none" }}
      >
        <span className="closePopupPost" onClick={closePopupPost}>
          &times;
        </span>
        <div className="post-popup-content">
          <div className="content-wrapper">
            <h2>Add a new picture</h2>
            <div className="empty-area">
              {postSelectedImages.length === 1 && (
                <div className="postPicAndComment">
                  <img
                    src={postSelectedImages[0]}
                    alt="Selected"
                    className="preview-image"
                  />
                  <input
                    type="text"
                    value={selectedText}
                    onChange={handleChange}
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
                onClick={(e) => (e.target.value = null)}
              />
              <button
                className="post-select-button"
                onClick={() => document.getElementById("fileInput").click()}
              >
                Drag here or Select from computer
              </button>
            </div>
          </div>
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={postSubmitting}
          >
            {postSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
      <div
        className="comment-popup"
        style={{ display: popupCommentVisible ? "block" : "none" }}
      >
        <div>
          <span className="close" onClick={closePopupComment}>
            &times;
          </span>
        </div>
        <div className="preview-image-container">
          {currentImage && (
            <img src={currentImage} alt="Selected" className="preview-image" />
          )}
        </div>
        <div className="popUpCommentHeader">
          <h2>Comments</h2>
        </div>
        <div className="comment-popup-content">
          {/* Comments will be displayed here */}
          {feedItems
            .filter((item) => item.images && item.images.includes(currentImage))
            .map((item, index) => (
              <div key={index} className="comment">
                {item.comments &&
                  item.comments.map((comment, idx) => (
                    <div key={idx}>{comment.content}</div>
                  ))}
              </div>
            ))}
        </div>
        <div className="comment-input">
          <input
            type="text"
            placeholder="Write your comment here..."
            value={commentSelectedText}
            onChange={(e) => setCommentSelectedText(e.target.value)}
          />
        </div>
        <div className="submit-comment">
          <button onClick={submitComment} disabled={popupCommentSubmitting}>
            {popupCommentSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
