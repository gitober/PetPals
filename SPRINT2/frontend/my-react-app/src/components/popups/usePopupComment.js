import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const usePopupComment = ({ commentsUrl, access_token, refresh_token }) => {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [popupCommentVisible, setPopupCommentVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const { simulateTestMode } = useTestModeInstance(); // Include the useTestModeInstance hook

  useEffect(() => {
    const fetchComments = async () => {
  try {
    const response = await fetch(commentsUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        const newAccessToken = await refreshToken(refresh_token);
        if (newAccessToken) {
          // Retry fetching comments with the new access token
          fetchComments();
        } else {
          throw new Error('Failed to refresh access token.');
        }
      } else {
        throw new Error(`Error fetching comments: ${response.statusText}`);
      }
    } else {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setComments(data);
      } else {
        throw new Error('Response is not in JSON format.');
      }
    }
  } catch (error) {
    // Handle the error gracefully
    console.error('Error fetching comments:', error.message);
  }
};

    fetchComments();
  }, [commentsUrl, access_token, refresh_token]);

  const refreshToken = async (refreshToken) => {
    try {
      const response = await fetch('/api/refresh_token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token }),
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh access token: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      // Handle the error gracefully
      console.error('Error refreshing access token:', error.message);
      return null;
    }
  };

  const submitComment = async () => {
    try {
      setSubmitting(true);

      if (selectedImages.length === 0 || !selectedText) {
        console.error('Selected image or comment text is missing.');
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedImages[0]);
      formData.append('content', selectedText);

      if (simulateTestMode) {
        console.log('Test mode: Simulating successful comment submission');
        // Simulate test mode behavior here
      } else {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          console.error(`Failed to submit comment: ${response.status}`);
          return;
        }

        const responseData = await response.json();
        setComments((prevComments) =>
          prevComments.map((item) =>
            item.images.includes(selectedImages[0]) ? { ...item, comments: responseData.comments } : item
          )
        );

        closePopupComment();
        setSelectedText('');
      }
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
    comments,
    submitting,
    popupCommentVisible,
    selectedText,
    setSelectedText,
    selectedImages,
    openPopupComment,
    closePopupComment,
  };
};

export default usePopupComment;