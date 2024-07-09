import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const usePopupComment = ({ setFeedItems }) => {
  const [comments, setComments] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [popupCommentVisible, setPopupCommentVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [currentPostId, setCurrentPostId] = useState(null); // Track current post ID
  const { simulateTestMode } = useTestModeInstance();

  useEffect(() => {
    const fetchComments = async () => {
      if (!currentPostId) return;

      try {
        if (!simulateTestMode) {
          const response = await fetch(`http://localhost:5000/api/posts/${currentPostId}/comments`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          if (!response.ok) {
            console.error(`Failed to fetch comments: ${response.status}`);
            return;
          }
          const data = await response.json();
          setComments(prevComments => ({ ...prevComments, [currentPostId]: data }));
        }
      } catch (error) {
        console.error('Error fetching comments:', error.message);
      }
    };
    fetchComments();
  }, [currentPostId, simulateTestMode]);

  const submitComment = async () => {
    try {
      setSubmitting(true);

      if (!simulateTestMode) {
        const response = await fetch(`http://localhost:5000/api/posts/${currentPostId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({
            content: selectedText,
          }),
        });

        if (!response.ok) {
          console.error(`Failed to submit comment: ${response.status}`);
          return;
        }

        const responseData = await response.json();
        const newComment = {
          id: Math.random().toString(),
          content: responseData.content,
          username: responseData.username, // Assuming the API response contains username
          date: new Date().toISOString(), // Assuming the current date/time as comment time
        };

        setComments(prevComments => ({
          ...prevComments,
          [currentPostId]: [...(prevComments[currentPostId] || []), newComment]
        }));

        setFeedItems(prevItems =>
          prevItems.map(item =>
            item.id === currentPostId ? { ...item, comments: [...item.comments, newComment] } : item
          )
        );
      } else {
        console.log('Test mode: Simulating comment submission');
        const simulatedComment = {
          id: Math.random().toString(),
          content: selectedText,
          username: 'TestUser', // Simulated username
          date: new Date().toISOString(), // Simulated current date/time
        };

        setComments(prevComments => ({
          ...prevComments,
          [currentPostId]: [...(prevComments[currentPostId] || []), simulatedComment]
        }));

        setFeedItems(prevItems =>
          prevItems.map(item =>
            item.id === currentPostId ? { ...item, comments: [...item.comments, simulatedComment] } : item
          )
        );

        console.log('Test mode: Comment submitted and added to state');
      }

      setSelectedText('');
    } catch (error) {
      console.error('Error during comment submission:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openPopupComment = (postId, imageUrl) => {
    setCurrentPostId(postId);
    setCurrentImage(imageUrl);
    setPopupCommentVisible(true);
  };

  const closePopupComment = () => {
    setPopupCommentVisible(false);
    setCurrentImage(null);
    setCurrentPostId(null);
  };

  return {
    setPopupCommentSelectedText: setSelectedText,
    comments: comments[currentPostId] || [], // Get comments for the current post ID
    setComments,
    submitting,
    popupCommentVisible,
    selectedText,
    setSelectedText,
    openPopupComment,
    closePopupComment,
    submitComment,
    currentImage,
    commentSelectedText: selectedText,
    setCommentSelectedText: setSelectedText,
  };
};

export default usePopupComment;
