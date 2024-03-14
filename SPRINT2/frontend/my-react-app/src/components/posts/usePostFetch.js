import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../../components/testmode/useTestMode';
import { useNavigate } from 'react-router-dom';

const usePostFetch = (accessToken) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { isTestMode, simulateTestMode } = useTestModeInstance();

  // Fetch initial posts
  const fetchInitialPosts = async (token) => {
    try {
      // Make an API call to fetch initial posts using the token
      const response = await fetch('http://localhost:5000/api/posts/posts', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error('Failed to fetch initial posts:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching initial posts:', error);
    }
  };

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const fetchedAccessToken = localStorage.getItem('accessToken');
        console.log('Fetched access token:', fetchedAccessToken);
        if (!fetchedAccessToken) {
          console.error('Access token is missing. Redirecting to login page.');
          navigate('/login');
          return;
        }
        // Fetch initial posts only if accessToken is available
        await fetchInitialPosts(fetchedAccessToken);
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };
    fetchAccessToken();
  }, [navigate]);

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
