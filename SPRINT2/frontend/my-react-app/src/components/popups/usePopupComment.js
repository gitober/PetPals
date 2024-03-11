import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const usePopupComment = ({ commentsUrl, token, selectedImages: initialSelectedImages, currentImage: initialCurrentImage }) => {
  const [comments, setComments] = useState([]);
  const [selectedText, setSelectedText] = useState(() => ''); // Initialize selectedText using a function
  const [submitting, setSubmitting] = useState(false);
  const [popupCommentVisible, setPopupCommentVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState(initialSelectedImages || []);
  const [currentImage, setCurrentImage] = useState(initialCurrentImage || null);
  const { isTestMode, simulateTestMode } = useTestModeInstance();

  const openPopupComment = (imageUrl) => {
    setSelectedImages([imageUrl]);
    setCurrentImage(imageUrl);
    setSelectedText("");
    setPopupCommentVisible(true);
    simulateTestMode("Opening comment popup");
  };

  const closePopupComment = () => {
    setPopupCommentVisible(false);
    setCurrentImage(null);
    simulateTestMode("Closing comment popup");
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (isTestMode) {
          simulateTestMode("Fetching comments in test mode");
          // Simulate test data or behavior here
          return;
        }

        console.log('Fetching comments...');
        const response = await fetch(commentsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          console.error(`Error fetching comments: ${response.statusText}`);
          return;
        }

        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);

        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setComments(data);  // Update comments state
        } else {
          // Handle other content types if needed
        }
      } catch (error) {
        console.error(`Error fetching comments: ${error.message}`);
      }
    };

    fetchComments();
    simulateTestMode("Fetching comments");
  }, [commentsUrl, token, currentImage, isTestMode, simulateTestMode]);

  const submitComment = async () => {
    simulateTestMode("Inside submitComment");

    try {
      setSubmitting(true);

      console.log("Selected Images:", selectedImages);

      if (isTestMode) {
        console.log("Test mode: Simulating successful comment submission");

        // Mock data for the new comment
        const newComment = {
          id: Math.random().toString(), // Unique identifier (replace this with your actual ID logic)
          content: selectedText,
          timestamp: new Date().toISOString(), // Add a timestamp
          username: "testuser", // Add the username of the commenter
          // Add other necessary fields
        };

        // Create a new array of comments including the new comment for the selected image
        setComments((prevComments) =>
  prevComments.map((item) =>
    item.images.includes(selectedImages[0])
      ? { ...item, comments: [...(item.comments || []), newComment] }
      : item
  )
);

        setSelectedText(""); // Clear the comment text
        // Comment popup will remain open in test mode
      } else {
        // Actual API request logic for non-test mode
        const formData = new FormData();
        formData.append("image", selectedImages[0]);  // Append only one image
        formData.append("content", selectedText);

        const response = await fetch(`/api/comments`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();

          setComments((prevComments) =>
            prevComments.map((item) =>
              item.images.includes(selectedImages[0])
                ? { ...item, comments: responseData.comments }
                : item
            )
          );

          closePopupComment(); // Close the comment popup after successful submission
          setSelectedText(""); // Clear the comment text
        } else {
          console.error(
            "Failed to submit comment:",
            response.status,
            response.statusText
          );
        }
      }
    } catch (error) {
      console.error("Error during comment submission:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // Use simulateTestMode to control test mode behavior
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
