import { useEffect, useState } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const usePostFetch = (setFeedItems) => {
  const { isTestMode } = useTestModeInstance();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!isTestMode) {
        // Normal mode: fetch posts from the server
        try {
          const response = await fetch('http://localhost:5000/api/posts');
          if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          setFeedItems(data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      } else {
        // Test mode: Load posts from localStorage
        const localPosts = localStorage.getItem('testPosts');
        if (localPosts) {
          setFeedItems(JSON.parse(localPosts));
        } else {
          console.log('No posts in localStorage, initializing with empty array');
          localStorage.setItem('testPosts', JSON.stringify([]));
          setFeedItems([]);
        }
      }
    };

    fetchPosts();
  }, [isTestMode, setFeedItems]);
};

export default usePostFetch;
