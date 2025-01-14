import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sanitizeImageUrl from "../utils/sanitizeImageUrl";

import PostPopup from "../features/posting/components/PostPopup";
import CommentPopup from "../features/comments/components/CommentPopup";
import LikeSection from "../features/likes/components/LikeSection";
import Sidebar from "../features/sidebar/components/Sidebar";
import SearchBar from "../features/search-bar/components/SearchBar";
import SearchResults from "../features/search-bar/components/SearchResults";
import BackToTop from "../features/back-to-top/components/BackToTop";
import FollowList from "../features/follow/components/FollowList";

import usePopupPost from "../features/posting/hooks/usePopupPost";
import usePopupComment from "../features/comments/hooks/usePopupComment";
import useLikes from "../features/likes/hooks/useLikes";
import useSearch from "../features/search-bar/hooks/useSearch";

import "../style/home.css";
import "../style/search-bar.css";
import "../style/sidebar.css";
import "../style/post-popup.css";
import "../style/comment-popup.css";
import "../style/interaction.css";

function Home() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || "/api";

  // State Variables
  const [feedItems, setFeedItems] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [selectedComments, setSelectedComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postImage, setPostImage] = useState("");

  // Custom Hooks for Post and Comment Popups
  const {
    popupPostVisible,
    openPopupPost,
    closePopupPost,
    handleSubmit,
    handleFileChange,
    handleChange,
    postText,
    selectedImages: postSelectedImages,
    setSelectedImages: setPostSelectedImages,
    submitting: postSubmitting,
  } = usePopupPost(apiUrl, accessToken, setFeedItems);

  const {
    comments,
    openPopupComment,
    closePopupComment,
    popupCommentVisible,
    commentSelectedText,
    setCommentSelectedText,
    submitComment,
    deleteComment,
    deletePost,
  } = usePopupComment({
    postId,
    setFeedItems,
  });

  // Custom Hook for Search Functionality
  const {
    searchTerm,
    setSearchTerm,
    handleKeyPress,
    searchResults,
    isLoading,
    error,
    clearSearchTerm,
  } = useSearch("", (term) => console.log(`Searching for: ${term}`), navigate);

  // Custom Hook for Likes
  const { likeCounts: likesData, likedPosts: likedPostsData, toggleLike } = useLikes();

  // Update Like Data When Likes Change
  useEffect(() => {
    setLikeCounts((prevCounts) => ({ ...prevCounts, ...likesData }));
    setLikedPosts((prevLiked) => ({ ...prevLiked, ...likedPostsData }));
  }, [likesData, likedPostsData]);

  // Fetch Access Token and Logged-in User ID
  useEffect(() => {
    const fetchedAccessToken = localStorage.getItem("accessToken");
    if (!fetchedAccessToken) {
      navigate("/login");
      return;
    }

    setAccessToken(fetchedAccessToken);

    fetch(`${apiUrl}/users/me`, {
      headers: { Authorization: `Bearer ${fetchedAccessToken}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch user data");
        return response.json();
      })
      .then((data) => setLoggedInUserId(data._id))
      .catch((err) => {
        console.error("Error fetching user data:", err.message);
      });
  }, [apiUrl, navigate]);

  // Fetch Posts for Home Feed
  useEffect(() => {
    if (!accessToken) return;

    setLoading(true);

    fetch(`${apiUrl}/posts`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch posts");
        return response.json();
      })
      .then((data) => setFeedItems(data))
      .catch((err) => {
        console.error("Error fetching posts:", err.message);
      })
      .finally(() => setLoading(false));
  }, [accessToken, apiUrl]);

  // Navigate to User Profile on Username Click
  const handleUsernameClick = (username, userId) => {
    if (userId === loggedInUserId) {
      navigate("/profile");
    } else {
      navigate(`/userprofile/${username}`);
    }
  };

  // Open Comment Popup for Selected Post
  const handleCommentIconClick = (image, id, comments) => {
    if (!id) {
      console.error("No postId provided for comments.");
      return;
    }

    setPostId(id);
    setPostImage(image || "");
    setSelectedComments(comments || []);
    openPopupComment(image || "");
  };

  if (loading) return <p>Loading feed...</p>;

  return (
    <>
      <div className="home-page-container">
        <BackToTop />
        <Sidebar openPopupPost={openPopupPost} />
        <div className="home-main-content">
          <div className="search-bar">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleKeyPress={handleKeyPress}
            />
            <SearchResults
              isLoading={isLoading}
              error={error}
              searchResults={searchResults}
              searchTerm={searchTerm}
              clearSearchTerm={clearSearchTerm}
            />
          </div>
          <div className="home-content">
            {/* Left: Home Feed */}
            <div className="home-feed">
              {feedItems.length > 0 ? (
                feedItems.map((item) => (
                  <div key={item._id || item.localKey} className="home-feed-item">
                    <p
                      className="home-feed-item-username"
                      onClick={() =>
                        handleUsernameClick(
                          item.user_id?.username,
                          item.user_id?._id
                        )
                      }
                    >
                      {item.user_id?.username || "Unknown User"}
                    </p>
                    <div className="home-feed-item-image-container">
                      <img
                        src={sanitizeImageUrl(item.image, apiUrl)}
                        alt="Post"
                        className="home-feed-item-image"
                        loading="lazy"
                        onError={(e) => (e.target.src = "/placeholder-image.png")}
                      />
                    </div>
                    <p className="home-feed-item-content">
                      {item.content?.trim() || "No content provided"}
                    </p>
                    <LikeSection
                      liked={likedPosts[item._id]}
                      toggleLike={toggleLike}
                      likeCount={likeCounts[item._id]}
                      postId={item._id}
                      handleCommentClick={() =>
                        handleCommentIconClick(
                          sanitizeImageUrl(item.image, apiUrl),
                          item._id,
                          Array.isArray(item.comments) ? item.comments : []
                        )
                      }
                    />
                  </div>
                ))
              ) : (
                <p className="no-posts-message">No posts available. Start creating content!</p>
              )}
            </div>
            {/* Right: Followings List */}
            <FollowList
              apiUrl={apiUrl}
              accessToken={accessToken}
              type="following" // or "followers"
              sanitizeImageUrl={sanitizeImageUrl}
            />
          </div>
        </div>
      </div>
      <PostPopup
        popupPostVisible={popupPostVisible}
        closePopupPost={closePopupPost}
        postText={postText}
        handleChange={handleChange}
        postSelectedImages={postSelectedImages}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        postSubmitting={postSubmitting}
      />
      <CommentPopup
        popupCommentVisible={popupCommentVisible}
        closePopupComment={closePopupComment}
        currentImage={postImage}
        postOwnerUsername={
          feedItems.find((item) => item._id === postId)?.user_id?.username || "Unknown User"
        }
        postImage={feedItems.find((item) => item._id === postId)?.image || ""}
        comments={Array.isArray(comments) ? comments : []}
        setComments={(newComments) =>
          setFeedItems((prevItems) =>
            prevItems.map((item) =>
              item._id === postId ? { ...item, comments: newComments } : item
            )
          )
        }
        apiUrl={apiUrl}
        loggedInUserId={loggedInUserId}
        postOwnerId={
          feedItems.find((item) => item._id === postId)?.user_id?._id ||
          feedItems.find((item) => item._id === postId)?.user_id
        }
        commentSelectedText={commentSelectedText}
        setCommentSelectedText={setCommentSelectedText}
        submitComment={submitComment}
        deleteComment={deleteComment}
        deletePost={deletePost}
        pageType={"home"}
        liked={likedPosts[postId]}
        toggleLike={toggleLike}
        likeCount={likeCounts[postId]}
        postId={postId}
      />
    </>
  );
};

export default Home;