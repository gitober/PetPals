import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const useLikes = () => {
  // State to track like counts for each image
  const [likeCounts, setLikeCounts] = useState({});
  // State to track whether the user has liked each image
  const [likedImages, setLikedImages] = useState({});
  // URL for the API (replace with your actual API URL)
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Get the test mode instance
  const { isTestMode, simulateTestMode } = useTestModeInstance();

  // Function to simulate like toggle or make API request
  const toggleLike = async (imageUrl) => {
  try {
    if (isTestMode) {
      console.log("Test mode: Simulating like toggle");
      // Simulate like toggle logic for testing
      return;
    }

    const url = `${apiUrl}/api/like`;
    const method = likedImages[imageUrl] ? 'DELETE' : 'POST';
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    };

    const response = await fetch(url, config);

    if (response.ok) {
      console.log('Like toggled successfully:', imageUrl);

      setLikeCounts((prevLikeCounts) => ({
        ...prevLikeCounts,
        [imageUrl]: (prevLikeCounts[imageUrl] || 0) + (likedImages[imageUrl] ? -1 : 1),
      }));

      setLikedImages((prevLikedImages) => ({
        ...prevLikedImages,
        [imageUrl]: !prevLikedImages[imageUrl],
      }));
    } else {
      console.error(
        `Failed to toggle like for ${imageUrl}: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error(`Error toggling like for ${imageUrl}: ${error.message}`);
  }
};

  useEffect(() => {
    // Use simulateTestMode to control test mode behavior
    if (isTestMode) {
      simulateTestMode({ /* Add any test data or behavior needed for useLikes */ });
    }
  }, [isTestMode, simulateTestMode]);

  // Return the state and the toggleLike function
  return { likeCounts, likedImages, toggleLike };
};

export default useLikes;
