import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const usePopupComment = ({ commentsUrl, postId }) => {
  const [comments, setComments] = useState([]);
  const [access_token, setAccessToken] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [popupCommentVisible, setPopupCommentVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const { isTestMode } = useTestModeInstance();
  const simulateTestMode = isTestMode ? true : false; // Set simulateTestMode based on isTestMode value

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const fetchedAccessToken = localStorage.getItem('accessToken');
        if (!fetchedAccessToken) {
          console.error('Access token is missing.');
          return;
        }
        setAccessToken(fetchedAccessToken);
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };
    fetchAccessToken();
  }, []);

  useEffect(() => {
  const fetchPostId = async () => {
    try {
      // Fetch postId asynchronously
      const postId = await fetchPostIdFromServer();
      setPostId(postId);
    } catch (error) {
      console.error('Error fetching postId:', error);
    }
  };

  fetchPostId();
}, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!access_token || !commentsUrl) {
          console.error('Access token or comments URL is missing.');
          return;
        }

        const response = await fetch(commentsUrl, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching comments: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType) {
          console.warn('Response does not have a content type:', response);
          return;
        }

        if (contentType.includes('application/json')) {
          const data = await response.json();
          setComments(data);
        } else if (contentType.includes('text/plain')) {
          const text = await response.text();
          console.warn('Response is plain text:', text);
        } else {
          console.warn('Response is in an unsupported format:', response);
        }
      } catch (error) {
        console.error('Error fetching comments:', error.message);
      }
    };

    fetchComments();
  }, [commentsUrl, access_token]);

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
      formData.append('postId', postId);

      if (simulateTestMode || !access_token || !commentsUrl) { // Check if in test mode or backend is unavailable
        console.log('Test mode: Simulating successful comment submission');
        // Simulate test mode behavior here
      } else {
        const response = await fetch(`http://localhost:5000/api/comments/comment/${postId}`, {
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

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('Response is not in JSON format:', response);
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
    submitComment,
  };
};

export default usePopupComment;
