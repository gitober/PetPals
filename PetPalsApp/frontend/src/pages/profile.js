import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sanitizeImageUrl from "../utils/sanitizeImageUrl";

import PostPopup from "../features/posting/components/PostPopup";
import CommentPopup from "../features/comments/components/CommentPopup";
import Sidebar from "../features/sidebar/components/Sidebar";
import SearchBar from "../features/search-bar/components/SearchBar";
import SearchResults from "../features/search-bar/components/SearchResults";
import BackToTop from "../features/back-to-top/components/BackToTop";
import FollowModal from "../features/follow/components/FollowModal";

import { UserContext } from "../features/user-context/hooks/UserContext";
import useSettings from "../features/settings/hooks/useSettings";
import usePopupPost from "../features/posting/hooks/usePopupPost";
import usePopupComment from "../features/comments/hooks/usePopupComment";
import useSearch from "../features/search-bar/hooks/useSearch";
import useLikes from "../features/likes/hooks/useLikes";

import "../style/profile.css";
import "../style/search-bar.css";
import "../style/sidebar.css";
import "../style/post-popup.css";
import "../style/comment-popup.css";
import "../style/interaction.css";
import "../style/back-to-top.css";
import "../style/follow-modal.css";

const Profile = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "/api";
  const navigate = useNavigate();

  // User Context
  const { username, profilePicture, bioText: defaultBioText, setProfilePicture, setBioText } = useContext(UserContext);

  // Settings and Hooks
  const { bioText } = useSettings(apiUrl, navigate);

  // State Variables
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [feedItems, setFeedItems] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [showFollowModal, setShowFollowModal] = useState({ type: null, list: [] });
  const [postId, setPostId] = useState("");
  const [postImage, setPostImage] = useState("");
  const [accessToken] = useState(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);
  const [deleteTargetPostId] = useState(null);

  const localStorageKey = `userProfile_${username}`;

  // Likes Hook
  const { likeCounts: likesData, likedPosts: likedPostsData, toggleLike } = useLikes();

  // Update Likes and Liked Posts
  useEffect(() => {
    setLikeCounts(likesData);
  }, [likesData]);

  useEffect(() => {
    setLikedPosts(likedPostsData);
  }, [likedPostsData]);

  // Search Hook
  const {
    searchTerm,
    setSearchTerm,
    handleKeyPress,
    searchResults,
    isLoading,
    error,
    clearSearchTerm,
  } = useSearch("", (term) => console.log(`Searching for: ${term}`), navigate);

  // Post Popup Hook
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

  // Comment Popup Hook
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
    deletePost,
  } = usePopupComment({
    postId,
    setFeedItems,
  });

  // Fetch and Save Profile Data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const storedProfile = localStorage.getItem(localStorageKey);

        if (storedProfile) {
          const { bioText: storedBio, profilePicture: storedPicture } = JSON.parse(storedProfile);
          setBioText(storedBio || "");
          setProfilePicture(storedPicture || "");
        }

        const response = await fetch(`${apiUrl}/users/${username}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();

          setBioText(userData.bioText || "");
          const sanitizedPicture = sanitizeImageUrl(userData.profilePicture, apiUrl);
          setProfilePicture(sanitizedPicture || "");

          setFollowers(userData.followersCount || 0);
          setFollowing(userData.followingCount || 0);

          saveProfileToLocalStorage(userData.bioText, sanitizedPicture);
        } else {
          console.error("Failed to fetch user profile data:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching user profile data:", error.message);
      }
    };

    fetchProfileData();
  }, [apiUrl, accessToken, username, setBioText, setProfilePicture]);

  // Fetch Logged-in User's ID
  useEffect(() => {
    const fetchLoggedInUserId = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setLoggedInUserId(data._id);
        } else {
          console.error("Failed to fetch logged-in user ID:", await response.text());
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching logged-in user ID:", error.message);
        navigate("/login");
      }
    };

    if (accessToken) {
      fetchLoggedInUserId();
    }
  }, [apiUrl, accessToken, navigate]);

  // Save Profile to Local Storage
  const saveProfileToLocalStorage = (bio, picture) => {
    const profileData = {
      bioText: bio || "",
      profilePicture: picture || "",
    };
    localStorage.setItem(localStorageKey, JSON.stringify(profileData));
  };

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
                ...post.user_id, 
                _id: post.user_id?._id || post.user_id,
                username: post.user_id?.username || username || "Unknown User",
              },
              image: post.image ? sanitizeImageUrl(post.image, apiUrl) : "/placeholder-image.png",
            }))
          );
        } else {
          console.error("Failed to fetch posts:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [apiUrl, username, accessToken, postId, deleteTargetPostId]);

  // Handle Opening Comment Popup
  const handleCommentIconClick = (image, id, comments) => {
    if (!id) {
      console.error("No postId provided for comments.");
      return;
    }

    setPostId(id);
    setPostImage(image || "");
    setComments(Array.isArray(comments) ? comments : []);
    openPopupComment();
  };

  // Handle Opening and Closing Follow Modal
  const handleShowModal = async (type) => {
    try {
      const response = await fetch(`${apiUrl}/users/${username}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        const list = type === "followers" ? data.followers : data.following;
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

  return (
    <>
      <div className="profile-container">
        <div className="profile-page-container">
          <BackToTop />
          <Sidebar openPopupPost={openPopupPost} />
          <div className="profile-page-main-content">
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
              <div className="profile-page-feed">
                <div className="profilepage-info">
                  <div className="profilepage-profilepicture-container">
                    <img
                      src={sanitizeImageUrl(profilePicture, apiUrl)}
                      alt="Profile Picture"
                      className="profilepage-profilepicture"
                      onError={(e) => (e.target.src = "/placeholder-image.png")}
                    />
                  </div>
                  <div className="profilepage-details-container">
                    <div className="profilepage-username">{username}</div>
                    <div className="profilepage-follower-following">
                      <p
                        onClick={() => handleShowModal("followers")}
                        style={{ cursor: "pointer" }}
                      >
                        {followers} Followers
                      </p>
                      <p
                        onClick={() =>
                          following > 0 && handleShowModal("following")
                        }
                        style={{
                          cursor: following > 0 ? "pointer" : "default",
                          opacity: following > 0 ? 1 : 0.5,
                        }}
                      >
                        {following} Following
                      </p>
                    </div>
                    <p className="profilepage-bio">
                      {bioText || "Welcome to my profile!"}
                    </p>
                  </div>
                </div>
                <hr className="profilepage-separator" />
                <div className="profilepage-feed-pictures-container">
                  {feedItems.map((item) => (
                    <div
                      key={item._id}
                      className="profilepage-feed-picture-container"
                      onClick={() =>
                        handleCommentIconClick(
                          `${apiUrl}/${item.image}`,
                          item._id,
                          Array.isArray(item.comments) ? item.comments : []
                        )
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
          } // Dynamically extract the username
          postImage={feedItems.find((item) => item._id === postId)?.image || ""}
          comments={Array.isArray(comments) ? comments : []}
          setComments={(newComments) =>
            setFeedItems((prevItems) =>
              prevItems.map((item) =>
                item._id === postId ? { ...item, comments: newComments } : item
              )
            )
          }
          setFeedItems={setFeedItems}
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
          pageType={"profile"}
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
      </div>
    </>
  );
};

export default Profile;