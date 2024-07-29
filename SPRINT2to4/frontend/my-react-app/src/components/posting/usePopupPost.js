import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const usePopupPost = (accessToken, setFeedItems, fetchInitialPosts) => {
  const { isTestMode, simulateTestMode } = useTestModeInstance();
  const [popupPostVisible, setPopupPostVisible] = useState(false);
  const [postText, setPostText] = useState(''); // Renamed for clarity
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
    setPostText(''); // Clear post text on close
    if (simulateTestMode) {
      simulateTestMode('Closing post popup');
    }
  };

  const handleChange = (e) => {
    setPostText(e.target.value); // Update post text
    console.log('postText updated:', e.target.value);
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
      formData.append('content', postText); // Use postText
  
      if (isTestMode) {
        console.log('Test mode: Simulating successful post submission');
  
        const newPost = {
          id: Math.random().toString(),
          images: selectedImages,
          content: postText,
          comments: [],
        };
  
        // Retrieve current posts from localStorage, add the new post to the start, and save it back to localStorage
        const currentPosts = JSON.parse(localStorage.getItem('testPosts')) || [];
        currentPosts.unshift(newPost); // Use unshift instead of push to add to the start
        localStorage.setItem('testPosts', JSON.stringify(currentPosts));
  
        // Update the state with the new list of posts
        setFeedItems(currentPosts);
  
        console.log('Test mode: Closing post popup');
        closePopupPost();
      } else {
        // Make an actual API call for creating a post
        const response = await fetch(`http://localhost:5000/api/posts`, {
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
          fetchInitialPosts();
  
          // Close the post popup after successful submission
          closePopupPost();
        } else {
          console.error('Failed to submit post:', response.statusText);
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
    postText, // Provide postText
    setPostText,
    selectedImages,
    setSelectedImages,
    submitting,
    setSubmitting,
  };
};

export default usePopupPost;
