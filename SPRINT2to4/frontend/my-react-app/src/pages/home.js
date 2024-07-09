import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearch from '../components/searchbar/useSearch';
import usePopupPost from '../components/posting/usePopupPost';
import PostPopup from '../components/posting/PostPopup';
import usePopupComment from '../components/comments/usePopupComment';
import CommentPopup from '../components/comments/CommentPopup';
import useLikes from '../components/likes/useLikes';
import LikeSection from '../components/likes/LikeSection';
import Sidebar from '../components/sidebar/Sidebar';
import SearchBar from '../components/searchbar/SearchBar'; // Import the new SearchBar component
import usePostFetch from '../components/posts/usePostFetch';
import { useTestModeInstance } from '../components/testmode/useTestMode';

import '../style/home.css';
import '../style/searchbar.css';
import '../style/sidebar.css';
import '../style/popuppost.css';
import '../style/popupcomment.css';
import '../style/likes.css';
import '../style/icons.css';

function Home() {
  const navigate = useNavigate();
  const { isTestMode, simulateTestMode } = useTestModeInstance();
  const [feedItems, setFeedItems] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likedImages, setLikedImages] = useState([]);
  const [selectedText, setSelectedText] = useState('');
  const [commentSelectedText, setCommentSelectedText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [postId, setPostId] = useState('');

  const [searchTerm, setSearchTerm, handleKeyPress] = useSearch('', (term) => {}, navigate);

  useEffect(() => {
    const fetchedAccessToken = localStorage.getItem('accessToken');
    if (fetchedAccessToken) {
      console.log('Access token retrieved:', fetchedAccessToken);
      setAccessToken(fetchedAccessToken);
    } else {
      console.error('Access token not found in localStorage');
    }
  }, []);

  const posts = usePostFetch(accessToken);

  const {
    popupPostVisible,
    openPopupPost,
    closePopupPost,
    handleSubmit,
    handleFileChange,
    handleChange,
    selectedImages: postSelectedImages,
    setSelectedImages: setPostSelectedImages,
    submitting: postSubmitting,
    setSubmitting: setPostSubmitting,
    updatePopupVisibility,
  } = usePopupPost(isTestMode, setFeedItems, accessToken, postId, simulateTestMode);

  const {
    comments,
    setComments,
    submitting: popupCommentSubmitting,
    setSelectedText: setPopupCommentSelectedText,
    submitComment,
    openPopupComment,
    closePopupComment,
    popupCommentVisible,
    setCurrentImage,
    currentImage,
  } = usePopupComment({
    postId,
    accessToken,
    commentsUrl: `http://localhost:5000/api/posts/${postId}/comments`, // Assuming you need a comments URL here
    setFeedItems,
  });

  const { likeCounts: likesData, likedImages: likedImagesData, toggleLike, testModeVisible: likesTestModeVisible } = useLikes();

  const handleInputChange = (e) => {
    setSelectedText(e.target.value);
    console.log('selectedText updated:', e.target.value);
  };

  useEffect(() => {
    const fetchHomeFeedPosts = async () => {
      try {
        if (!isTestMode) {
          const response = await fetch('http://localhost:5000/api/posts', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();

          if (response.ok) {
            setFeedItems(data);
          } else {
            console.error('Failed to fetch posts:', response.status, response.statusText);
          }
        } else {
          console.log('Test mode: Simulating fetchHomeFeedPosts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchHomeFeedPosts();
  }, [accessToken, isTestMode]);

  useEffect(() => {
    if (likesTestModeVisible) {
      simulateTestMode({ /* Add test data for useLikes */ });
      setLikeCounts(likesData);
    }
  }, [likesTestModeVisible, likesData]);

  useEffect(() => {
    setLikedImages(likedImagesData);
  }, [likedImagesData]);

  return (
    <div>
      <div className="home-page-container">
        <Sidebar openPopupPost={openPopupPost} />
        <div className="home-main-content">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleKeyPress={handleKeyPress}
          />
          <div className="home-feed">
            {feedItems.map((item, index) => (
              <div key={index} className="feed-item">
                <a href="../userprofile">
                  <h3>username</h3>
                </a>
                <img src={item.images[0]} alt={`User's Post ${index}`} />
                <div className="icons">
                  <LikeSection
                    liked={likedImages[item.images[0]]}
                    toggleLike={toggleLike}
                    imageUrl={item.images[0]}
                    likeCount={likeCounts[item.images[0]]}
                    postId={item.postId}
                  />
                  <img
                    src="../img/comment.png"
                    alt="Image"
                    className="icon"
                    onClick={() => openPopupComment(item.images[0])}
                  />
                </div>
                <p>{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <PostPopup
        popupPostVisible={popupPostVisible}
        closePopupPost={closePopupPost}
        selectedText={setSelectedText}
        handleChange={handleChange}
        postSelectedImages={postSelectedImages}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        postSubmitting={postSubmitting}
      />
      <CommentPopup
        popupCommentVisible={popupCommentVisible}
        closePopupComment={closePopupComment}
        currentImage={currentImage}
        comments={comments}
        setComments={setComments} // Ensure this is passed
        commentSelectedText={commentSelectedText}
        setCommentSelectedText={setCommentSelectedText}
        submitComment={submitComment}
        popupCommentSubmitting={popupCommentSubmitting}
      />
    </div>
  );
}

export default Home;
