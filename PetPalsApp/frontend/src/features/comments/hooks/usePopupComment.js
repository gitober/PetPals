import { useState, useEffect } from "react";

const apiUrl = process.env.REACT_APP_API_URL || "/api";

const usePopupComment = ({ postId, setFeedItems }) => {
  const [comments, setComments] = useState([]); // Comments for the current post
  const [submitting, setSubmitting] = useState(false); // Indicates if a comment is being submitted
  const [popupCommentVisible, setPopupCommentVisible] = useState(false); // Popup visibility
  const [selectedText, setSelectedText] = useState(""); // Text input for new comment
  const [currentImage, setCurrentImage] = useState(null); // Image associated with the current post
  const [popupPosition, setPopupPosition] = useState({ top: "50%", left: "50%" });
  const [notification, setNotification] = useState(null); // Notification state

  // Show notification for a limited time
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
  };

  // Fetch comments for the current post
  useEffect(() => {
    if (!postId) return; // Skip fetching if postId is not set

    const fetchComments = async () => {
      try {
        const response = await fetch(`${apiUrl}/comments?postId=${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch comments: ${response.status}`);
          return;
        }

        const data = await response.json();
        const formattedComments = data.map((comment) => {
          const createdAtDate = new Date(comment.createdAt);
          const formattedDate = `${createdAtDate.getDate()}.${
            createdAtDate.getMonth() + 1
          }.${createdAtDate.getFullYear()} - ${createdAtDate
            .getHours()
            .toString()
            .padStart(2, "0")}:${createdAtDate.getMinutes().toString().padStart(2, "0")}`;
          return {
            ...comment,
            formattedDate,
          };
        });

        setComments(formattedComments); // Update the comments state with formatted data
      } catch (error) {
        console.error("Error fetching comments:", error.message);
      }
    };

    fetchComments();
  }, [postId]);

  // Submit a new comment
  const submitComment = async (newComment) => {
    setSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ ...newComment, postId }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const savedComment = await response.json();
      setComments((prev) => [savedComment, ...prev]);
      setSelectedText("");
      showNotification("Comment added successfully.");
    } catch (error) {
      console.error("Error during comment submission:", error.message);
      showNotification("An error occurred while adding the comment.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete a post
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`${apiUrl}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error.message);
      throw error;
    }
  };
  

  // Delete a comment
const deleteComment = async (commentId) => {
  try {
    const response = await fetch(`${apiUrl}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }

    const result = await response.json();
    console.log("Deleted Comment:", result.deletedComment); // Debugging log

    // Update comments state by filtering out the deleted comment
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));

    showNotification("Comment deleted successfully.");
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    showNotification("An error occurred while deleting the comment.");
  }
};

  // Open the comment popup for a specific post
  const openPopupComment = (imageUrl) => {
    setCurrentImage(imageUrl);
    setSelectedText("");
    setPopupPosition({ top: "50%", left: "50%" });
    setPopupCommentVisible(true);
  };

  // Close the comment popup
  const closePopupComment = () => {
    setPopupCommentVisible(false);
    setCurrentImage(null);
  };

  return {
    comments,
    setComments,
    submitting,
    popupCommentVisible,
    selectedText,
    setSelectedText,
    openPopupComment,
    closePopupComment,
    submitComment,
    deletePost,
    deleteComment,
    currentImage,
    notification, // Expose the notification state
    showNotification, // Expose the showNotification function
    commentSelectedText: selectedText,
    setCommentSelectedText: setSelectedText,
    apiUrl,
  };
};

export default usePopupComment;
