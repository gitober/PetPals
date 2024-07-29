import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const useLikes = () => {
  const [likeCounts, setLikeCounts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [testModeVisible, setTestModeVisible] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const { isTestMode, simulateTestMode } = useTestModeInstance();

  const updateLikeState = (postId, response) => {
    setLikeCounts((prevCounts) => ({
      ...prevCounts,
      [postId]: (prevCounts[postId] || 0) + (likedPosts[postId] ? -1 : 1),
    }));

    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [postId]: !prevLikedPosts[postId],
    }));

    if (!response.ok) {
      console.error(`Failed to toggle like for post ${postId}: ${response.status} ${response.statusText}`);
    }
  };

  const toggleLike = async (postId) => {
    try {
      if (isTestMode) {
        console.log('Test mode: Simulating like toggle');
        // Simulate like toggle logic for testing
        updateLikeState(postId, { ok: true }); // Simulate a successful response in test mode
        return;
      }

      const url = `${apiUrl}/api/like`;
      const method = likedPosts[postId] ? 'DELETE' : 'POST';
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }), // Correctly pass the postId as an object property
      };

      const response = await fetch(url, config);
      updateLikeState(postId, response);

      console.log(`Like toggled ${response.ok ? 'successfully' : 'unsuccessfully'}`);
    } catch (error) {
      console.error(`Error toggling like for post ${postId}: ${error.message}`);
    }
  };

  useEffect(() => {
    if (isTestMode) {
      simulateTestMode({ /* Add any test data or behavior needed for useLikes */ });
      setTestModeVisible(true);
    } else {
      console.log('Test mode is off');
      // You might want to add a production-specific logic here
    }
  }, [isTestMode, simulateTestMode]);

  return { likeCounts, likedPosts, toggleLike, testModeVisible };
};

export default useLikes;
