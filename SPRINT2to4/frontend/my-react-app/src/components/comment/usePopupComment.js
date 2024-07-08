import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const usePopupComment = ({ commentsUrl, postId, setFeedItems }) => {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [popupCommentVisible, setPopupCommentVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const { simulateTestMode } = useTestModeInstance();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!simulateTestMode) {
          const response = await fetch(commentsUrl, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          if (!response.ok) {
            console.error(`Failed to fetch comments: ${response.status}`);
            return;
          }
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error.message);
      }
    };
    fetchComments();
  }, [commentsUrl, simulateTestMode]);

  const submitComment = async () => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('image', selectedImages[0]);
      formData.append('content', selectedText);

      if (!simulateTestMode) {
        const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          console.error(`Failed to submit comment: ${response.status}`);
          return;
        }

        const responseData = await response.json();
        const newComment = {
          id: Math.random().toString(),
          content: selectedText,
          image: selectedImages[0],
          username: responseData.username, // Assuming the API response contains username
          date: new Date().toISOString(), // Assuming the current date/time as comment time
        };

        setComments(prevComments => [...prevComments, newComment]);
        setFeedItems(prevItems =>
          prevItems.map(item =>
            item.id === postId ? { ...item, comments: [...item.comments, newComment] } : item
          )
        );
      } else {
        console.log('Test mode: Simulating comment submission');
        const simulatedComment = {
          id: Math.random().toString(),
          content: selectedText,
          image: selectedImages[0], // assuming comments in test mode might also include images
          username: 'TestUser', // Simulated username
          date: new Date().toISOString(), // Simulated current date/time
        };

        setComments(prevComments => [...prevComments, simulatedComment]);
        setFeedItems(prevItems =>
          prevItems.map(item =>
            item.id === postId ? { ...item, comments: [...item.comments, simulatedComment] } : item
          )
        );

        console.log('Test mode: Comment submitted and added to state');
      }

      closePopupComment();
      setSelectedText('');
    } catch (error) {
      console.error('Error during comment submission:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openPopupComment = (imageUrl) => {
    setSelectedImages([imageUrl]);
    setCurrentImage(imageUrl);
    setSelectedText('');
    setPopupCommentVisible(true);
  };

  const closePopupComment = () => {
    setPopupCommentVisible(false);
    setCurrentImage(null);
  };

  return {
    setPopupCommentSelectedText: setSelectedText,
    comments,
    submitting,
    popupCommentVisible,
    selectedText,
    setSelectedText,
    selectedImages,
    openPopupComment,
    closePopupComment,
    submitComment,
    currentImage,
    commentSelectedText: selectedText,
    setCommentSelectedText: setSelectedText,
  };
};

export default usePopupComment;
