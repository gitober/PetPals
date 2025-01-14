import React, { useState, useEffect } from "react";

const FollowButton = ({ isFollowing, followUser, unfollowUser, isLoading, userId, setFollowerCount }) => {
  const localStorageKey = `isFollowing_${userId}`; // Unique key for each user
  const [localIsFollowing, setLocalIsFollowing] = useState(isFollowing);

  // Initialize state from localStorage or fallback to prop
  useEffect(() => {
    const storedState = localStorage.getItem(localStorageKey);
    if (storedState !== null) {
      setLocalIsFollowing(storedState === "true"); // Convert string to boolean
    } else {
      setLocalIsFollowing(isFollowing); // Use the prop as fallback
    }
  }, [isFollowing, localStorageKey]);

  // Save to localStorage whenever local state changes
  useEffect(() => {
    localStorage.setItem(localStorageKey, localIsFollowing.toString());
  }, [localIsFollowing, localStorageKey]);

  // Follow button click handler
  const handleFollowClick = async () => {
    if (localIsFollowing) {
      await handleUnfollow();
    } else {
      await handleFollow();
    }
  };

  // Follow handler
  const handleFollow = async () => {
    setLocalIsFollowing(true); // Optimistic update
    try {
      const success = await followUser(); // Sync with backend
      if (!success) throw new Error("Failed to follow user");
      setFollowerCount((prev) => prev + 1); // Update follower count on success
    } catch (error) {
      console.error("Follow failed:", error.message);
      setLocalIsFollowing(false); // Revert on failure
    }
  };

  // Unfollow handler
  const handleUnfollow = async () => {
    setLocalIsFollowing(false); // Optimistic update
    try {
      const success = await unfollowUser(); // Sync with backend
      if (!success) throw new Error("Failed to unfollow user");
      setFollowerCount((prev) => prev - 1); // Update follower count on success
    } catch (error) {
      console.error("Unfollow failed:", error.message);
      setLocalIsFollowing(true); // Revert on failure
    }
  };

  return (
    <button
      className={`follow-button ${localIsFollowing ? "following" : ""}`}
      onClick={handleFollowClick}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : localIsFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
