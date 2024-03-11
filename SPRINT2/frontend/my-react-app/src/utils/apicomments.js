import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';
import commentApi from '../../utils/apicomments'; // Import your comment API functions

const usePopupComment = ({ commentsUrl, token, selectedImages: initialSelectedImages, currentImage: initialCurrentImage }) => {
  const [comments, setComments] = useState([]);
  const [selectedText, setSelectedText] = useState(() => '');
  const [submitting, setSubmitting] = useState(false);
  const [popupCommentVisible, setPopupCommentVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState(initialSelectedImages || []);
  const [currentImage, setCurrentImage] = useState(initialCurrentImage || null);
  const { isTestMode, simulateTestMode } = useTestModeInstance();

  const openPopupComment = (imageUrl) => {
    setSelectedImages([imageUrl]);
    setCurrentImage(imageUrl);
    setSelectedText('');
    setPopupCommentVisible(true);
    simulateTestMode('Opening comment popup');
  };

  const closePopupComment = () => {
    setPopupCommentVisible(false);
    setCurrentImage(null);
    simulateTestMode('Closing comment popup');
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (isTestMode) {
          simulateTestMode('Fetching comments in test mode');
          // Simulate test data or behavior here
          return;
        }

        console.log('Fetching comments...');
        const fetchedComments = await commentApi.getComments(commentsUrl, token);
        setComments(fetchedComments);
      } catch (error) {
        console.error(`Error fetching comments: ${error.message}`);
      }
    };

    fetchComments();
    simulateTestMode('Fetching comments');
  }, [commentsUrl, token, currentImage, isTestMode, simulateTestMode]);

  const submitComment = async () => {
    simulateTestMode('Inside submitComment');

    try {
      setSubmitting(true);

      console.log('Selected Images:', selectedImages);

      if (isTestMode) {
        console.log('Test mode: Simulating successful comment submission');

        const newComment = {
          id: Math.random().toString(),
          content: selectedText,
          timestamp: new Date().toISOString(),
          username: 'testuser',
        };

        setComments((prevComments) =>
          prevComments.map((item) =>
            item.images.includes(selectedImages[0])
              ? { ...item, comments: [...(item.comments || []), newComment] }
              : item
          )
        );

        setSelectedText('');
      } else {
        const response = await commentApi.createComment(currentImage, { content: selectedText }, token);

        if (response.ok) {
          const responseData = await response.json();

          setComments((prevComments) =>
            prevComments.map((item) =>
              item.images.includes(selectedImages[0])
                ? { ...item, comments: responseData.comments }
                : item
            )
          );

          closePopupComment();
          setSelectedText('');
        } else {
          console.error('Failed to submit comment:', response.status, response.statusText);
        }
      }
    } catch (error) {
      console.error('Error during comment submission:', error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isTestMode) {
      simulateTestMode({ /* Add any test data or behavior needed for usePopupComment */ });
    }
  }, [isTestMode, simulateTestMode]);

  return {
    comments,
    selectedText,
    submitting,
    setSelectedText,
    submitComment,
    openPopupComment,
    closePopupComment,
    popupCommentVisible,
    selectedImages: selectedImages || [],
    setCurrentImage,
    currentImage,
  };
};

export default usePopupComment;
