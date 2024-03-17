import { useEffect, useState } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const usePostFetch = () => {
  const [posts, setPosts] = useState([]);
  const { isTestMode, simulateTestMode } = useTestModeInstance();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!isTestMode) { // Check if test mode is active
          const response = await fetch('http://localhost:5000/api/posts');
          
          if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
          }
  
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid response format: expected JSON');
          }
  
          const data = await response.json();
          setPosts(data);
        } else {
          // Simulate test mode behavior
          console.log('Test mode: Simulating fetchPosts');
          // Add any additional test mode behavior for fetchPosts
          simulateTestMode('Simulating fetchPosts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error.message);
        // Handle error gracefully, such as displaying an error message to the user
      }
    };

    fetchPosts();
  }, [isTestMode]); // Include isTestMode here

  return posts;
};

export default usePostFetch;
