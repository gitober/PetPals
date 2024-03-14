import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const useLikes = () => {
  const [likeCounts, setLikeCounts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [testModeVisible, setTestModeVisible] = useState(false);
  const { isTestMode, simulateTestMode } = useTestModeInstance();

  const toggleLike = (postId) => {
    setLikedPosts((prevLikedPosts) => {
      const isLiked = !prevLikedPosts[postId];
      const updatedLikedPosts = { ...prevLikedPosts, [postId]: isLiked };

      // Update like count directly
      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        [postId]: (prevCounts[postId] || 0) + (isLiked ? 1 : -1),
      }));

      return updatedLikedPosts;
    });
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
