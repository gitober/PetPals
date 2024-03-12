import { useState, useEffect, useCallback } from "react";
import { useTestModeInstance } from '../testmode/useTestMode';

export function useHomeFeed(postsUrl) {
  const { isTestMode, simulateTestMode } = useTestModeInstance();
  const [feedItems, setFeedItems] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likedImages, setLikedImages] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchHomeFeedPosts = useCallback(async () => {
    try {
      if (isTestMode) {
        simulateTestMode("Fetching home feed posts in test mode");
        // Simulate test data or behavior here
        return;
      }

      const url = postsUrl || `${apiUrl}/api/posts`;
      const config = { /* Add your headers or configurations here */ };

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
  }, [setFeedItems, feedItems, apiUrl, isTestMode, simulateTestMode, postsUrl]);

  const toggleLike = async (imageUrl) => {
    try {
      const url = `${apiUrl}/api/like`;
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      };

      const response = await fetch(url, config);

      if (response.ok) {
        // Update likeCounts and likedImages based on the server response
        // You may need to modify this part based on your server response structure
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
      } else {
        console.error(
          "Failed to toggle like:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error.message);
    }
  };

  useEffect(() => {
    fetchHomeFeedPosts();
  }, [fetchHomeFeedPosts]);

  return {
    feedItems,
    likeCounts,
    likedImages,
    fetchHomeFeedPosts,
    toggleLike,
  };
}
