import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../../hooks/otherhooks/useTestMode';
import postsApi from '../../utils/apiposts'; // Import your posts API functions

const usePostFetch = () => {
  const [posts, setPosts] = useState([]);
  const { isTestMode, simulateTestMode } = useTestModeInstance();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (isTestMode) {
          // Simulate test mode behavior for fetching posts
          simulateTestMode('Simulating fetchPosts in test mode');
          // Simulate test data or behavior here
        } else {
          // Make an actual API call for fetching posts
          const fetchedPosts = await postsApi.getPosts();
          setPosts(fetchedPosts);
        }
      } catch (error) {
        console.error('Error during initial post fetch:', error.message);
      }
    };

    fetchPosts();
  }, [isTestMode, simulateTestMode]);

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
