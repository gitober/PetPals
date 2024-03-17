import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const usePopupPost = (accessToken, setFeedItems, fetchInitialPosts) => {
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
    console.log('Access Token:', accessToken);
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
          // Make an actual API call for creating a post
          const response = await fetch(`http://localhost/5000/api/posts`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });

          if (response.ok) {
            const responseData = await response.json();

            // Log the entire response for debugging
            console.log('Response:', responseData);

            // Fetch initial posts after successful submission
            fetchInitialPosts(accessToken);

            // Close the post popup after successful submission
            closePopupPost();
          } else {
            console.error('Failed to submit post:', response.statusText);
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
  };
};

export default usePopupPost;
