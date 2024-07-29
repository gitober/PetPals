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
import SearchBar from '../components/searchbar/SearchBar';
import usePostFetch from '../components/homefeed/usePostFetch';
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
  const [likedPosts, setLikedPosts] = useState({});
  const [selectedText, setSelectedText] = useState('');
  const [commentSelectedText, setCommentSelectedText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [postId, setPostId] = useState('');
  const [selectedComments, setSelectedComments] = useState([]);

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

  usePostFetch(setFeedItems);

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
    commentsUrl: `http://localhost:5000/api/posts/${postId}/comments`,
    setFeedItems,
  });

  const { likeCounts: likesData, likedPosts: likedPostsData, toggleLike, testModeVisible: likesTestModeVisible } = useLikes();

  const handleInputChange = (e) => {
    setSelectedText(e.target.value);
    console.log('selectedText updated:', e.target.value);
  };

  useEffect(() => {
    if (likesTestModeVisible) {
      simulateTestMode({ /* Add test data for useLikes */ });
      setLikeCounts(likesData);
    }
  }, [likesTestModeVisible, likesData]);

  useEffect(() => {
    setLikedPosts(likedPostsData);
  }, [likedPostsData]);

  const handleCommentIconClick = (image, id, comments) => {
    setPostId(id);
    setSelectedComments(comments);
    openPopupComment(image);
  };

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
                  <h3>{item.username}</h3>
                </a>
                <img src={item.images[0]} alt={`User's Post ${index}`} />
                <div className="icons">
                  <LikeSection
                    liked={likedPosts[item.id]}
                    toggleLike={toggleLike}
                    likeCount={likeCounts[item.id]}
                    postId={item.id}
                  />
                  <img
                    src="../img/comment.png"
                    alt="Image"
                    className="icon"
                    onClick={() => handleCommentIconClick(item.images[0], item.id, item.comments)}
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
        comments={selectedComments}
        setComments={(newComments) => {
          setSelectedComments(newComments);
          setFeedItems(feedItems.map(item => 
            item.id === postId ? { ...item, comments: newComments } : item
          ));
        }}
        commentSelectedText={commentSelectedText}
        setCommentSelectedText={setCommentSelectedText}
        submitComment={submitComment}
        popupCommentSubmitting={popupCommentSubmitting}
      />
    </div>
  );
}

export default Home;
