import { useState, useEffect } from "react";

const usePopupPost = (apiUrl, accessToken, setFeedItems) => {
  // State Management
  const [popupPostVisible, setPopupPostVisible] = useState(false);
  const [postText, setPostText] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: "50%", left: "50%" });

  // Log Popup Visibility Changes
  useEffect(() => {
    console.log("PopupPostVisible changed:", popupPostVisible);
  }, [popupPostVisible]);

  // Cleanup Image URLs on Selection Change
  useEffect(() => {
    selectedImages.forEach((imageUrl) => URL.revokeObjectURL(imageUrl));
  }, [selectedImages]);

  // Open Post Popup
  const openPopupPost = () => {
    console.log("Opening post popup");
    setPopupPosition({ top: "50%", left: "50%" });
    setPopupPostVisible(true);
  };

  // Close Post Popup
  const closePopupPost = () => {
    console.log("Closing post popup");
    setPopupPostVisible(false);
    setSelectedImages([]);
    setPostText("");
  };

  // Submit Post
  const handleSubmit = async () => {
    if (!selectedImages.length) {
      console.error("No image selected");
      return;
    }

    console.log("Submitting post with the following data:");
    console.log("Post Text:", postText);
    console.log("Selected Image File:", selectedImages[0]);

    const formData = new FormData();
    formData.append("content", postText);
    formData.append("image", selectedImages[0]);

    const cleanApiUrl = apiUrl.replace(/\/+$/, ""); // Remove trailing slashes

    try {
      const response = await fetch(`${cleanApiUrl}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to add post: ${response.statusText}`);
      }

      const newPost = await response.json();

      const sanitizedPost = {
        ...newPost,
        image: newPost.image
          ? newPost.image.startsWith("http")
            ? newPost.image
            : `${cleanApiUrl}/${newPost.image.replace(/^\/?/, "")}`
          : "/placeholder-image.png",
      };

      setFeedItems((prevFeed) => [sanitizedPost, ...prevFeed]);
      closePopupPost();
    } catch (error) {
      console.error("Error submitting post:", error.message);
    }
  };

  // Handle File Selection
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      setSelectedImages([file]);
      console.log("Selected Image:", file);
    }
  };

  // Handle Text Input Change
  const handleChange = (e) => {
    setPostText(e.target.value);
    console.log("postText updated:", e.target.value);
  };

  return {
    popupPostVisible,
    openPopupPost,
    closePopupPost,
    handleSubmit,
    handleFileChange,
    handleChange,
    postText,
    selectedImages,
    submitting,
  };
};

export default usePopupPost;