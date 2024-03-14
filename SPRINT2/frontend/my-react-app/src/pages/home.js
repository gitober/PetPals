import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestModeInstance } from '../components/testmode/useTestMode';
import usePostFetch from '../components/posts/usePostFetch';
import usePopupComment from '../components/popups/usePopupComment';
import usePopupPost from '../components/popups/usePopupPost';
import useSearch from '../components/searchbar/useSearch';
import useLikes from '../components/likes/uselikes';
import useSidebar from '../components/sidebar/useSidebar';
import '../style/home.css';
import '../style/searchbar.css';
import '../style/sidebar.css';
import '../style/popuppost.css';
import '../style/popupcomment.css';

function Home() {
  // State variables
  const [feedItems, setFeedItems] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeImage, setLikeImage] = useState("../img/like.png");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [commentImage, setCommentImage] = useState("../img/comment.png");
  const [commentVisible, setCommentVisible] = useState(false);
  const [popupCommentSubmitting, setPopupCommentSubmitting] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  // Use useTestModeInstance hook
  const getToken = async () => {
    return accessToken;
  };

 // Function to toggle test mode
  const fetchInitialPosts = async (token) => {
    setAccessToken(token);
  };

  // Use useSidebar hook for sidebar functionality
const { popupPostVisible: sidebarPopupPostVisible, openPopupPost: openSidebarPopupPost, setPopupPostVisible: setSidebarPopupPostVisible } = useSidebar();

  // Use usePostFetch hook
  const posts = usePostFetch();

  // Use useNavigate hook
  const navigate = useNavigate();

  // Use useTestModeInstance hook
  const { isTestMode, simulateTestMode } = useTestModeInstance();

  // Use useLikes hook
  const { likeCounts, likedPosts, toggleLike, testModeVisible } = useLikes();

  // Use usePopupComment hook
  const { handleFileChange } = usePopupPost();

  // Use usePopupComment hook
  const { handleSubmit } = usePopupPost();

  // Use usePopupComment hook
  const { comments, submitting: commentSubmitting, popupCommentVisible, selectedText: commentSelectedText, setSelectedText: setCommentSelectedText, selectedImages: commentSelectedImages, openPopupComment, closePopupComment, submitComment } = usePopupComment({ commentsUrl: `http://localhost:5000/api/comments/comment/${postId}`, access_token: accessToken, postId: postId });

  // Use usePopupPost hook for post functionality
  const { popupPostVisible, openPopupPost, closePopupPost, handleSubmit: postSubmit, handleFileChange: postHandleFileChange, handleChange: postHandleChange, selectedText: postSelectedText, setSelectedText: setPostSelectedText, selectedImages: postSelectedImages, setSelectedImages: setPostSelectedImages, submitting: postSubmitting, setSubmitting: setPostSubmitting, postSelectedImages: postSelectedImagesPost, setSelectedImage: setPostSelectedImage } = usePopupPost(getToken, setFeedItems, fetchInitialPosts);

  // Use useSearch hook
  const [searchTerm, setSearchTerm, handleKeyPress] = useSearch('', (term) => {
    // Implement your search logic here
    console.log('Searching for:', term);
  }, navigate);


  // Fetch access token from localStorage and set it
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const fetchedAccessToken = localStorage.getItem('accessToken');
        console.log('Fetched access token:', fetchedAccessToken);
        if (!fetchedAccessToken) {
          console.error('Access token is missing. Redirecting to login page.');
          navigate('/login');
          return;
        }
        setAccessToken(fetchedAccessToken);
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };
    fetchAccessToken();
  }, [navigate]);

  // Fetch home feed posts
  useEffect(() => {
    const fetchHomeFeedPosts = async () => {
  try {
    const url = `http://localhost:5000/api/posts/posts`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await fetch(url, config);
    if (response.ok) {
      const responseData = await response.json();
      if (Array.isArray(responseData)) {
        // Assuming each post item in responseData already has a postId property
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
};
    if (accessToken) {
      fetchHomeFeedPosts();
    }
  }, [accessToken]);


  // Function to toggle follow
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowers(prevFollowers => (isFollowing ? prevFollowers - 1 : prevFollowers + 1));
    setFollowing(prevFollowing => (isFollowing ? prevFollowing - 1 : prevFollowing + 1));
  };

  useEffect(() => {
    if (isTestMode) {
      console.log('Test mode is active');
      // Add any test mode specific logic here
    }
  }, [isTestMode]);

  // Example usage
  const handleCommentSubmit = () => {
    // Call submitComment function when the user submits a comment
    submitComment();
  };

   // Example usage
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Example usage
  const handleOpenPopup = () => {
    openPopupPost();
  };

  // Example usage
  const handleToggleTestMode = () => {
    toggleTestMode();
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
          {feedItems && feedItems.map((item, index) => (
            <div key={index} className="feed-item">
            <a href="../userprofile">
            <h3>username</h3>
        </a>
        {item.images && item.images[0] && (
            <img
                src={item.images[0]}
                alt={`User's Post ${index}`}
                onClick={() => handleImageClick(item.images[0])}
            />
        )}
        <div className="icons">
            <div className="like-container">
    {/* Like icon */}
    {likedPosts[item.images[0]] ? (
        <img
            src="../img/liked.png"
            alt="Image Liked"
            className="like-icon"
            id={`likeIcon-${index}`}
            onClick={() => {
                toggleLike(item.images[0], item.postId);
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
                onClick={() => openPopupComment(item.images[0], item.postId)} 
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
              {postSelectedImages && postSelectedImages.length === 1 && (
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
          {feedItems &&
          feedItems
    .filter((item) => item.images && item.images.includes(currentImage))
    .map((item, index) => (
      <div key={index} className="comment">
        {item.comments && item.comments.map((comment, idx) => (
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
