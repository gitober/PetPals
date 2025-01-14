import { useState, useEffect } from "react";

const useLikes = () => {
  // State Management
  const [likeCounts, setLikeCounts] = useState({}); // Stores like counts for posts
  const [likedPosts, setLikedPosts] = useState({}); // Stores liked status for posts
  const apiUrl = process.env.REACT_APP_API_URL || "/api";

  // Update Like State
  const updateLikeState = (postId, likeChange) => {
    setLikeCounts((prevCounts) => ({
      ...prevCounts,
      [postId]: (prevCounts[postId] || 0) + likeChange,
    }));

    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [postId]: !prevLikedPosts[postId],
    }));
  };

  // Toggle Like
  const toggleLike = async (postId) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const url = `${apiUrl}/posts/${postId}/like`;
      const method = likedPosts[postId] ? "DELETE" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const likeChange = likedPosts[postId] ? -1 : 1;
        updateLikeState(postId, likeChange);
        console.log(`Successfully toggled like for post ${postId}`);
      } else {
        const error = await response.json();
        console.error(`Failed to toggle like for post ${postId}:`, error.message);
      }
    } catch (error) {
      console.error(`Error toggling like for post ${postId}: ${error.message}`);
    }
  };

  // Fetch Initial Likes
  useEffect(() => {
    const fetchInitialLikes = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await fetch(`${apiUrl}/posts`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const posts = await response.json();
          const initialLikeCounts = {};
          const initialLikedPosts = {};

          posts.forEach((post) => {
            initialLikeCounts[post._id] = post.likeCount || 0;
            initialLikedPosts[post._id] = post.isLiked || false;
          });

          setLikeCounts(initialLikeCounts);
          setLikedPosts(initialLikedPosts);
        } else {
          console.error("Failed to fetch initial like data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching initial like data:", error.message);
      }
    };

    fetchInitialLikes();
  }, [apiUrl]);

  return { likeCounts, likedPosts, toggleLike };
};

export default useLikes;
