import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const usePopupComment = ({ commentsUrl, postId }) => {
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
      if (!simulateTestMode) { // Check if not in test mode
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

    if (!simulateTestMode) { // Check if not in test mode
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error(`Failed to submit comment: ${response.status}`);
        return;
      }

      const responseData = await response.json();
      // Update local comments state with the new comment
      setComments((prevComments) =>
        prevComments.map((item) =>
          item.images.includes(selectedImages[0]) ? { ...item, comments: responseData.comments } : item
        )
      );
    } else {
      console.log('Test mode: Simulating successful comment submission');
      // Simulate adding the comment to the local state
      const newComment = { id: Math.random().toString(), content: selectedText };
      setComments((prevComments) =>
        prevComments.map((item) =>
          item.images.includes(selectedImages[0]) ? { ...item, comments: [...item.comments, newComment] } : item
        )
      );
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
  };
};

export default usePopupComment;
