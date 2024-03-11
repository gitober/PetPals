import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../../hooks/otherhooks/useTestMode';
import postsApi from '../../utils/apiposts'; // Import your posts API functions

const usePostFetch = (token) => {
  const [posts, setPosts] = useState([]);
  const { isTestMode, simulateTestMode } = useTestModeInstance();

  useEffect(() => {
    const fetchPosts = async () => {
      console.log('Token:', token);
      try {
        if (!token) {
          console.error('Token is null or undefined.');
          return;
        }

        // Use the getPosts function from your posts API
        const fetchedPosts = await postsApi.getPosts(token);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error during initial post fetch:', error.message);
      }
    };

    fetchPosts();
  }, [token, simulateTestMode]);

  useEffect(() => {
    if (isTestMode) {
      // Simulate test mode behavior
      console.log('Test mode: Simulating fetchPosts');
      // Add any additional test mode behavior for fetchPosts
      simulateTestMode('Simulating fetchPosts');
    }
  }, [isTestMode, simulateTestMode]);

  return posts;
};

export default usePostFetch;
