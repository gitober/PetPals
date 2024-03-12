import React, { useState, useEffect, useCallback } from 'react';
import { useTestModeInstance } from '../components/testmode/useTestMode';
import { useNavigate } from 'react-router-dom';
import useSearch from '../components/searchbar/useSearch';
import usePopupPost from '../components/popups/usePopupPost';
import usePopupComment from '../components/popups/usePopupComment';
import useLikes from '../components/likes/useLikes';
import authApi from '../utils/apiauth';
import '../style/home.css';
import '../style/searchbar.css';
import '../style/sidebar.css';
import '../style/popuppost.css';
import '../style/popupcomment.css';

function Home() {
  // State variables
  const { isTestMode, simulateTestMode } = useTestModeInstance();
  const [feedItems, setFeedItems] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likedImages, setLikedImages] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [commentSelectedText, setCommentSelectedText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [testModeVisible, setTestModeVisible] = useState(false);
  const [refreshToken, setRefreshToken] = useState(null);


  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const {
    popupPostVisible,
    openPopupPost,
    closePopupPost,
    handleSubmit,
    handleFileChange,
    selectedImages: postSelectedImages,
    setSelectedImages: setPostSelectedImages,
    submitting: postSubmitting,
    setSubmitting: setPostSubmitting,
    updatePopupVisibility,
  } = usePopupPost(isTestMode, setFeedItems);

  const {
    comments,
    submitting: popupCommentSubmitting,
    setSelectedText: setPopupCommentSelectedText,
    submitComment,
    openPopupComment,
    closePopupComment,
    popupCommentVisible,
    setCurrentImage,
    currentImage,
  } = usePopupComment({
    commentsUrl: '/api/comments',
    token: 'yourAuthToken',
    selectedImages: postSelectedImages,
    currentImage: postSelectedImages.length > 0 ? postSelectedImages[0] : null,
    setFeedItems,
  });

  const { likeCounts: likesData, likedImages: likedImagesData, toggleLike, testModeVisible: likesTestModeVisible } = useLikes();

 const navigate = useNavigate();
  const [searchTerm, setSearchTerm, handleKeyPress] = useSearch('', (term) => {
    // Handle search logic here, if needed
  }, navigate);


  const handleChange = (e) => {
    setSelectedText(e.target.value);
    console.log('selectedText updated:', e.target.value);
  };

  const fetchHomeFeedPosts = useCallback(async () => {
    try {
      if (!isComponentMounted) {
        return; // Stop fetching if the component is not mounted
      }

      if (isTestMode) {
        simulateTestMode('Fetching home feed posts in test mode');
        // Simulate test data or behavior here
        return;
      }

      const url = `${apiUrl}/api/posts`;
      const config = { /* Add your headers or configurations here */ };

      const response = await fetch(url, config);

      if (response.ok) {
        const responseData = await response.json();

        if (responseData && responseData.data && responseData.data.posts) {
          const postsArray = responseData.data.posts;

          setFeedItems((prevItems) => {
            const updatedItems = [...prevItems, ...postsArray];
            console.log('Updated Feed Items:', updatedItems);
            return updatedItems;
          });
        } else {
          console.error('Invalid response format. Expected data.posts to be an array. Received:', responseData);
        }
      } else {
        console.error(
          'Failed to fetch posts:',
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error during initial post fetch:', error.message);
    }
  }, [setFeedItems, apiUrl, isTestMode, simulateTestMode]);

  const [isComponentMounted, setIsComponentMounted] = useState(true);

  useEffect(() => {
    setIsComponentMounted(true);

    // Cleanup function to handle component unmounting
    return () => {
      setIsComponentMounted(false);
    };
  }, []);

  useEffect(() => {
  fetchHomeFeedPosts();
}, []);

   useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        if (!isTestMode) {
          const { accessToken, refreshToken } = await authApi.refreshToken();

          if (accessToken) {
            setAccessToken(accessToken);
            // Set the default Authorization header for all fetch calls
            fetch.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            // Store the refresh token in your component's state
            setRefreshToken(refreshToken);
          } else {
            console.error('Failed to refresh access token.');
            // Handle the case where the refresh token is invalid or expired
          }
        }
      } catch (error) {
        console.error(`Error refreshing access token: ${error.message}`);
        // Handle error as needed
      }
    };

    fetchAccessToken();
  }, [isTestMode]);

  useEffect(() => {
    if (likesTestModeVisible) {
      simulateTestMode({ /* Add any test data or behavior needed for useLikes */ });
      setTestModeVisible(true); // Set visibility in test mode
      likeCounts && setLikeCounts(likesData);
    } else {
    }
  }, [apiUrl, simulateTestMode, likesTestModeVisible]);

  useEffect(() => {
    setLikedImages(likedImagesData);
  }, [likedImagesData]);

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
                    {/* Conditional rendering of like icon based on liked status */}
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
