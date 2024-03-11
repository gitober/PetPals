import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';
import postsApi from '../../utils/apiposts'; // Import your posts API functions

const usePopupPost = (token, setFeedItems, fetchInitialPosts) => {
  const { isTestMode, simulateTestMode } = useTestModeInstance();
  const [popupPostVisible, setPopupPostVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Define the function to update popup visibility
  const updatePopupVisibility = (isVisible) => {
    setPopupPostVisible(isVisible);
  };

  useEffect(() => {
    console.log('PopupPostVisible changed:', popupPostVisible);
  }, [popupPostVisible]);

  useEffect(() => {
    if (!isTestMode) {
      selectedImages.forEach((imageUrl) => URL.revokeObjectURL(imageUrl));
    }
  }, [selectedImages, isTestMode]);

  const openPopupPost = () => {
    console.log('Opening post popup');
    setPopupPostVisible(true);
    if (simulateTestMode) {
      simulateTestMode('Opening post popup');
      // Additional logic...
    }
  };

  const closePopupPost = () => {
    console.log('Closing post popup');
    setPopupPostVisible(false);
    setSelectedImages([]);
    setSelectedText('');
    if (simulateTestMode) {
      simulateTestMode('Closing post popup');
    }
  };

  const handleChange = (e) => {
    setSelectedText(e.target.value);
    console.log('selectedText updated:', e.target.value);
  };

  const handleSubmit = async () => {
  console.log('Inside handleSubmit');
  console.log('Access Token:', token);
  console.log('Selected Images:', selectedImages);
  console.log('Submit button clicked');

  if (selectedImages.length === 0) {
    console.error('No image selected for submission.');
    return;
  }

  try {
    setSubmitting(true);

    const formData = new FormData();
    selectedImages.forEach((imageDataUrl, index) => {
      formData.append(`images[${index}]`, imageDataUrl);
    });
    formData.append('content', selectedText);

    if (isTestMode) {
      console.log('Test mode: Simulating successful post submission');
      console.log('Test mode: Closing post popup');

      const newPost = {
        id: Math.random().toString(),
        images: selectedImages,
        content: selectedText,
        comments: [],
      };

      setSelectedImages([]);
      console.log('New Post Data:', newPost);

      setFeedItems((prevFeedItems) => [newPost, ...prevFeedItems]);

      closePopupPost();
    } else {
      try {
        // Use the createPost function from your posts API
        const response = await postsApi.createPost(formData, token);

        if (response.message === 'Post created successfully') {
          fetchInitialPosts(token);
          closePopupPost();
        } else {
          console.error('Failed to submit post:', response.message);
        }
      } catch (error) {
        console.error('Error during post submission:', error);
      }
    }
  } finally {
    setSubmitting(false);
  }
};

  const handleFileChange = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    const newImages = Array.from(files);

    Promise.all(
      newImages.map((image) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(image);
        });
      })
    ).then((imageDataUrls) => {
      setSelectedImages(imageDataUrls);
    });
  }
};

  return {
    popupPostVisible,
    openPopupPost,
    closePopupPost,
    handleSubmit,
    handleFileChange,
    handleChange,
    selectedText,
    setSelectedText,
    selectedImages,
    setSelectedImages,
    submitting,
    setSubmitting,
    updatePopupVisibility, // Expose the function
  };
};

export default usePopupPost;
