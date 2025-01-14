import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../features/sidebar/components/Sidebar";
import SearchBar from "../features/search-bar/components/SearchBar";
import SearchResults from "../features/search-bar/components/SearchResults";
import CommentPopup from "../features/comments/components/CommentPopup";
import FollowButton from "../features/follow/components/FollowButton";
import PostPopup from "../features/posting/components/PostPopup";
import BackToTop from "../features/back-to-top/components/BackToTop";
import FollowModal from "../features/follow/components/FollowModal";

import { UserContext } from "../features/user-context/hooks/UserContext";
import useSearch from "../features/search-bar/hooks/useSearch";
import usePopupComment from "../features/comments/hooks/usePopupComment";
import useLikes from "../features/likes/hooks/useLikes";
import useFollow from "../features/follow/hooks/useFollow";

import "../style/user-profile.css";
import "../style/search-bar.css";
import "../style/sidebar.css";
import "../style/comment-popup.css";
import "../style/interaction.css";
import "../style/back-to-top.css";
import "../style/follow-modal.css";

const UserProfile = () => {
  // User and Context Initialization
  const { username } = useParams();
  const {
    userId: loggedInUserId,
    bioText,
    profilePicture,
    setProfilePicture,
  } = useContext(UserContext);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || "/api";
  const accessToken = localStorage.getItem("accessToken");

  // State Management
  const [feedItems, setFeedItems] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [postId, setPostId] = useState("");
  const [postImage, setPostImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFollowModal, setShowFollowModal] = useState({ type: null, list: [] });
  const [userDetails, setUserDetails] = useState({
    profilePicture: "",
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
  });
  const [localFollowerCount, setLocalFollowerCount] = useState(0);

  // Hooks for Likes, Comments, and Search
  const { likeCounts: likesData, likedPosts: likedPostsData, toggleLike } = useLikes();
  const {
    comments,
    openPopupComment,
    closePopupComment,
    popupCommentVisible,
    commentSelectedText,
    setComments,
    setCommentSelectedText,
    submitComment,
    deleteComment,
  } = usePopupComment({ postId, setFeedItems });
  const {
    searchTerm,
    setSearchTerm,
    handleKeyPress,
    searchResults,
    error,
    clearSearchTerm,
  } = useSearch("", (term) => console.log(`Searching for: ${term}`), navigate);
  const { isFollowing, followerCount, followingCount, followUser, unfollowUser, isLoading } = useFollow(username, loggedInUserId);

  // Effect: Update Local Follower Count
  useEffect(() => {
    setLocalFollowerCount(followerCount);
  }, [followerCount]);

  // Effect: Redirect if Not Logged In
  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  // Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/users/${username}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.ok) {
          const userData = await response.json();
          const profilePicture = userData.profilePicture.startsWith("/")
            ? `${window.location.origin}${userData.profilePicture}`
            : userData.profilePicture;

          setProfilePicture(profilePicture);
          setUserDetails({
            ...userData,
            profilePicture,
            followersCount: userData.followersCount || 0,
            followingCount: userData.followingCount || 0,
            isFollowing: userData.isFollowing || false,
          });
        } else {
          console.error("Failed to fetch user details:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, apiUrl, accessToken, setProfilePicture]);

  // Fetch User Posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/posts/user/${username}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.ok) {
          const posts = await response.json();
          setFeedItems(
            posts.map((post) => ({
              ...post,
              user_id: {
                ...post.user_id, // Retain existing properties of user_id
                username: post.user_id?.username || username || "Unknown User",
              },
              image: post.image ? sanitizeImageUrl(post.image, apiUrl) : "/placeholder-image.png",
            }))
          );
        } else {
          console.error("Failed to fetch user posts:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching user posts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [username, apiUrl, accessToken]);


  // Update Like Counts and Liked Posts
  useEffect(() => {
    setLikeCounts(likesData);
  }, [likesData]);
  useEffect(() => {
    setLikedPosts(likedPostsData);
  }, [likedPostsData]);

  // Open Comment Popup
  const handleCommentIconClick = (image, id, comments) => {
    if (!id) return;

    setPostId(id);
    setPostImage(image || "");
    setComments(Array.isArray(comments) ? comments : []);
    openPopupComment();
  };

  // Open Post Popup and Navigate to Profile
  const openPopupPost = () => {
    navigate("/profile");
  };

  // Follow Modal Management
  const handleShowModal = async (type) => {
    try {
      const response = await fetch(`${apiUrl}/users/${username}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        const list = (type === "followers" ? data.followers : data.following).map((user) => ({
          ...user,
          profilePicture: sanitizeImageUrl(user.profilePicture, apiUrl) || "/placeholder-image.png",
        }));

        setShowFollowModal({ type, list });
      } else {
        console.error(`Failed to fetch user data:`, await response.text());
      }
    } catch (error) {
      console.error(`Error fetching user data:`, error.message);
    }
  };

  const handleCloseModal = () => {
    setShowFollowModal({ type: null, list: [] });
  };

  // Helper for Userprofile to Sanitize Image API URL
  const sanitizeImageUrl = (url, apiUrl) => {
    if (!url) return "/placeholder-image.png";
    const baseApiUrl = apiUrl.replace(/\/+$/, "").replace(/\/api$/, "");
    return url.startsWith("http") ? url : `${baseApiUrl}/${url.replace(/^\/+/, "")}`;
  };

  return (
    <>
      <div className={`userprofile-page-container ${popupCommentVisible ? "blur-for-comment" : ""}`}>
        <div className="userprofile-container">
          <BackToTop />
          <Sidebar openPopupPost={openPopupPost} />
          <div className="userprofile-main-content">
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
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="userprofile-feed">
                <div className="userprofile-info">
                  <div className="userprofile-profilepicture-container">
                    <img
                      src={sanitizeImageUrl(profilePicture, apiUrl)}
                      alt="Profile Picture"
                      className="userprofile-profilepicture"
                      onError={(e) => (e.target.src = "/placeholder-image.png")}
                    />
                  </div>
                  <div className="userprofile-details-container">
                    <div className="userprofile-username-container">
                      <div className="userprofile-username">{username}</div>
                      <div className="follow-button-container">
                        <FollowButton
                          isFollowing={userDetails.isFollowing}
                          followUser={followUser}
                          unfollowUser={unfollowUser}
                          isLoading={isLoading}
                          userId={userDetails._id}
                          setFollowerCount={(newCount) =>
                            setUserDetails((prev) => ({
                              ...prev,
                              followersCount: newCount,
                            }))
                          }
                        />

                      </div>
                    </div>
                    <div className="userprofile-follower-following">
                      <p
                        onClick={() => handleShowModal("followers")}
                        style={{ cursor: "pointer" }}
                      >
                        {localFollowerCount} Followers
                      </p>
                      <p
                        onClick={() =>
                          userDetails.followingCount > 0 &&
                          handleShowModal("following")
                        }
                        style={{
                          cursor: userDetails.followingCount > 0 ? "pointer" : "default",
                          opacity: userDetails.followingCount > 0 ? 1 : 0.5,
                        }}
                      >
                        {userDetails.followingCount} Following
                      </p>
                    </div>
                    <p className="userprofile-bio">{bioText}</p>
                  </div>
                </div>
                <hr className="profilepage-separator" />
                <div className="userprofile-feed-pictures-container">
                  {feedItems.map((item) => (
                    <div
                      key={item._id}
                      className="userprofile-feed-picture-container"
                      onClick={() =>
                        handleCommentIconClick(`${apiUrl}/${item.image}`, item._id, item.comments)
                      }
                    >
                      {item.image && (
                        <img
                          src={sanitizeImageUrl(item.image, apiUrl)}
                          alt="User's Post"
                          className="post-image"
                          onError={(e) => {
                            console.error("Error loading image for post:", item);
                            e.target.src = "/placeholder-image.png";
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <PostPopup />
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
        pageType={"userprofile"}
        liked={likedPosts[postId]}
        toggleLike={toggleLike}
        likeCount={likeCounts[postId]}
        postId={postId}
      />
      {showFollowModal.type && (
        <FollowModal
          title={
            showFollowModal.type === "followers"
              ? `${showFollowModal.list.length} Followers`
              : `${showFollowModal.list.length} Following`
          }
          list={showFollowModal.list}
          onClose={handleCloseModal}
          sanitizeImageUrl={sanitizeImageUrl}
        />
      )}
    </>
  );
};

export default UserProfile;
