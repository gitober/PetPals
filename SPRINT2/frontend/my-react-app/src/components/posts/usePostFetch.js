import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../../components/testmode/useTestMode';

const usePostFetch = (accessToken) => {
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
          const response = await fetch('/api/posts', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            console.error(`Failed to fetch posts: ${response.statusText}`);
            return;
          }

          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error during initial post fetch:', error.message);
      }
    };

    fetchPosts();
  }, [accessToken, isTestMode, simulateTestMode]);

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
