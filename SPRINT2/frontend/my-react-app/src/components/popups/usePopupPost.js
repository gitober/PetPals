import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const usePopupPost = (getToken, setFeedItems, fetchInitialPosts) => {
  const { isTestMode, simulateTestMode } = useTestModeInstance();
  const [popupPostVisible, setPopupPostVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

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
    const token = await getToken(); // Retrieve the token dynamically
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
      selectedImages.forEach((imageFile, index) => {
        formData.append(`images[${index}]`, imageFile);
      });
      formData.append('content', selectedText);

      try {
        // Make an actual API call for creating a post
        const response = await fetch('http://localhost:5000/api/posts/posts', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();

          // Log the entire response for debugging
          console.log('Response:', responseData);

          // Fetch initial posts after successful submission
          fetchInitialPosts(token);

          // Close the post popup after successful submission
          closePopupPost();
        } else {
          console.error('Failed to submit post:', response.statusText);
        }
      } catch (error) {
        console.error('Error during post submission:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const newImages = Array.from(files);
      setSelectedImages(newImages);
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
  };
};

export default usePopupPost;
