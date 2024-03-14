import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const useLikes = () => {
  const [likeCounts, setLikeCounts] = useState({});
  const [likedImages, setLikedImages] = useState({});
  const [testModeVisible, setTestModeVisible] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const { isTestMode, simulateTestMode } = useTestModeInstance();

  const updateLikeState = (imageUrl, response) => {
    setLikeCounts((prevCounts) => ({
      ...prevCounts,
      [imageUrl]: (prevCounts[imageUrl] || 0) + (likedImages[imageUrl] ? -1 : 1),
    }));

    setLikedImages((prevLikedImages) => ({
      ...prevLikedImages,
      [imageUrl]: !prevLikedImages[imageUrl],
    }));

    if (!response.ok) {
      console.error(`Failed to toggle like for ${imageUrl}: ${response.status} ${response.statusText}`);
    }
  };

  const toggleLike = async (imageUrl) => {
  try {
    if (isTestMode) {
      console.log('Test mode: Simulating like toggle');
      // Simulate like toggle logic for testing
      updateLikeState(imageUrl, { ok: true }); // Simulate a successful response in test mode
      return;
    }

    const url = `${apiUrl}/api/like`;
    const method = likedImages[imageUrl] ? 'DELETE' : 'POST';
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }), // Correctly pass the imageUrl as an object property
    };

    const response = await fetch(url, config);
    updateLikeState(imageUrl, response);

    console.log(`Like toggled ${response.ok ? 'successfully' : 'unsuccessfully'}`);
  } catch (error) {
    console.error(`Error toggling like for ${imageUrl}: ${error.message}`);
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

  return { likeCounts, likedImages, toggleLike, testModeVisible };
};

export default useLikes;