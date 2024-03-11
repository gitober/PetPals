import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const useLikes = () => {
  const [likeCounts, setLikeCounts] = useState({});
  const [likedImages, setLikedImages] = useState({});

  const { isTestMode, simulateTestMode } = useTestModeInstance();

  const toggleLike = (imageUrl) => {
    setLikeCounts((prevLikeCounts) => ({
      ...prevLikeCounts,
      [imageUrl]: (prevLikeCounts[imageUrl] || 0) + (likedImages[imageUrl] ? -1 : 1),
    }));

    setLikedImages((prevLikedImages) => ({
      ...prevLikedImages,
      [imageUrl]: !prevLikedImages[imageUrl],
    }));
  };

  useEffect(() => {
    // Use simulateTestMode to control test mode behavior
    if (isTestMode) {
      simulateTestMode({ /* Add any test data or behavior needed for useLikes */ });
    }
  }, [isTestMode, simulateTestMode]);

  return { likeCounts, likedImages, toggleLike };
};

export default useLikes;
