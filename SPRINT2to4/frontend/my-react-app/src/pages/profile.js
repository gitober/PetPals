import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import useSearch from "../components/searchbar/useSearch";
import PostPopup from "../components/posting/PostPopup";
import CommentPopup from "../components/comments/CommentPopup";
import LikeSection from "../components/likes/LikeSection";
import usePostFetch from "../components/homefeed/usePostFetch";
import usePopupPost from "../components/posting/usePopupPost";
import usePopupComment from "../components/comments/usePopupComment";
import { useTestModeInstance } from "../components/testmode/useTestMode";
import Sidebar from "../components/sidebar/Sidebar";
import SearchBar from "../components/searchbar/SearchBar";
import useLikes from "../components/likes/useLikes"; 
import "../style/profile.css";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/popuppost.css";
import "../style/popupcomment.css";

const Profile = () => {
  const navigate = useNavigate();
  const { username, profilePicture, bioText } = useContext(UserContext);
  const { isTestMode, simulateTestMode } = useTestModeInstance();
  const [feedItems, setFeedItems] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [postId, setPostId] = useState('');
  const [selectedComments, setSelectedComments] = useState([]);
  const [commentSelectedText, setCommentSelectedText] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [selectedText, setSelectedText] = useState('');
  const [postText, setPostText] = useState('');

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
    setPostText(e.target.value); // Update postText, not selectedText
    console.log('postText updated:', e.target.value);
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
    setSelectedComments(comments || []); // Ensure comments is an array
    openPopupComment(image || ''); // Provide a fallback image or handle null appropriately
  };
  

  return (
    <div className="profile-page-container">
      <Sidebar openPopupPost={openPopupPost} />

      <div className="profile-page-main-content">
      <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleKeyPress={handleKeyPress}
          />

        <div className="profile-page-feed">
          <div className="profilepage-info">
            <div className="profilepage-username">
              <h2>
                {username}
                <br />
                <div className="profilepage-follower-following">
                  <h3>{followers} Followers </h3>
                  <h3>{following} Following</h3>
                </div>
                <p>{bioText}</p>
              </h2>
            </div>

            <div className="profilepage-profilepicture-container">
              <img
                src={profilePicture}
                alt="profilepage Picture"
                className="profilepage-profilepicture"
              />
            </div>
          </div>

          <div className="profilepage-details">
            <h4></h4>
            <h2 className="line2"></h2>
          </div>

          <div className="profilepage-feed-pictures-container">
  {feedItems
    .filter(item => item.images && item.images.length > 0) // Filter out posts without images
    .map((item, index) => (
      <div key={index} className="profilepage-feed-picture-container">
        <a href="../userprofile">
          <h3>{item.username}</h3>
        </a>
        {item.images && item.images.length > 0 && (
          <img src={item.images[0]} alt={`User's Post ${index}`} className="post-image" />
        )}
        <p className="post-content">{item.content}</p> {/* Separate container for text */}
        <div className="icons">
          <LikeSection
            liked={likedPosts[item.id]}
            toggleLike={toggleLike}
            likeCount={likeCounts[item.id]}
            postId={item.id}
          />
          <img
            src="../img/comment.png"
            alt="Comment"
            className="icon"
            onClick={() => handleCommentIconClick(item.images[0], item.id, item.comments)}
          />
        </div>
      </div>
    ))}
</div>




        </div>
      </div>

      <PostPopup
  popupPostVisible={popupPostVisible}
  closePopupPost={closePopupPost}
  postText={postText}
  handleChange={handleInputChange} // Pass the correct handler
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
};

export default Profile;
