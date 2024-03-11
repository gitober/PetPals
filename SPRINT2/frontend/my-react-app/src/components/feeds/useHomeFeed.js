import { useState, useEffect, useCallback } from "react";
import { useAuth } from '../../context/AuthContext';
import { useTestModeInstance } from '../testmode/useTestMode';

export function useHomeFeed(postsUrl) {
  const { token } = useAuth();
  const { isTestMode, simulateTestMode } = useTestModeInstance();
  const [feedItems, setFeedItems] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likedImages, setLikedImages] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchHomeFeedPosts = useCallback(async () => {
    try {
      if (!token && !isTestMode) {
        console.error("Token is null or undefined.");
        return;
      }

      if (isTestMode) {
        simulateTestMode("Fetching home feed posts in test mode");
        // Simulate test data or behavior here
        return;
      }

      const url = postsUrl || `${apiUrl}/api/posts`;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await fetch(url, config);

      if (response.ok) {
        const data = await response.json();
        setFeedItems((prevItems) => [...prevItems, ...data.posts]);
        console.log("Updated Feed Items:", feedItems);
      } else {
        console.error(
          "Failed to fetch posts:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error during initial post fetch:", error.message);
    }
  }, [token, setFeedItems, feedItems, apiUrl, isTestMode, simulateTestMode, postsUrl]);

  useEffect(() => {
    if ((token || isTestMode) && likedImages.length === 0) {
      fetchHomeFeedPosts();
    }
  }, [token, likedImages, fetchHomeFeedPosts, isTestMode]);

  const toggleLike = (imageUrl) => {
    setLikeCounts((prevLikeCounts) => {
      const updatedLikeCounts = { ...prevLikeCounts };
      updatedLikeCounts[imageUrl] = updatedLikeCounts[imageUrl] ? 0 : 1;
      return updatedLikeCounts;
    });

    setLikedImages((prevLikedImages) => {
      const updatedLikedImages = { ...prevLikedImages };
      updatedLikedImages[imageUrl] = !prevLikedImages[imageUrl];
      return updatedLikedImages;
    });
  };

  return {
    feedItems,
    likeCounts,
    likedImages,
    fetchHomeFeedPosts,
    toggleLike,
  };
}
