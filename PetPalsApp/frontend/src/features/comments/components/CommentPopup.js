import React, { useEffect, useRef, useState } from "react";
import LikeSection from "../../likes/components/LikeSection";
import DeleteModal from "../../delete-modal/components/DeleteModal";

const CommentPopup = ({
  popupCommentVisible,
  closePopupComment,
  postImage,
  comments = [],
  setComments,
  commentSelectedText,
  setCommentSelectedText,
  popupCommentSubmitting,
  submitComment,
  deleteComment,
  deletePost,
  apiUrl,
  loggedInUserId,
  postOwnerId,
  postOwnerUsername,
  pageType,
  liked,
  toggleLike,
  likeCount,
  postId,
  setFeedItems,
}) => {
  const modalRef = useRef(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState(null);

  // **Background scrolling toggle**
  useEffect(() => {
    if (popupCommentVisible) {
      document.body.style.overflow = "hidden"; // Disable background scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable background scrolling
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [popupCommentVisible]);

  // Helper: Show notifications
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Close popup on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!deleteModalVisible && modalRef.current && !modalRef.current.contains(e.target)) {
        closePopupComment();
      }
    };

    if (popupCommentVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [popupCommentVisible, deleteModalVisible]);

  // Confirm deletion logic (handles both post and comment deletion)
  const confirmDelete = async () => {
    try {
      if (!deleteTarget) {
        await deletePost(postId); // Delete post
        showNotification("Post deleted successfully.");
        closePopupComment();
        setFeedItems((prevItems) => prevItems.filter((item) => item._id !== postId));
      } else {
        await deleteComment(deleteTarget); // Delete comment
        setComments((prev) => prev.filter((comment) => comment._id !== deleteTarget));
        showNotification("Comment deleted successfully.");
      }
    } catch (error) {
      console.error("Error during deletion:", error.message);
      showNotification("An error occurred while deleting.");
    } finally {
      setDeleteModalVisible(false);
      setDeleteTarget(null);
    }
  };

  // Submit a new comment
  const handleSubmit = () => {
    if (!commentSelectedText.trim()) {
      showNotification("Comment cannot be empty!");
      return;
    }
    submitComment({
      userId: loggedInUserId,
      content: commentSelectedText,
    });
    setCommentSelectedText("");
  };

  return (
    popupCommentVisible && (
      <div className="comment-popup-overlay">
        {/* Notification */}
        {notification && (
          <div className="notification">
            {notification}
            <button onClick={() => setNotification(null)}>&times;</button>
          </div>
        )}

        <div className="comment-popup" ref={modalRef}>

          {/* Delete Post Button */}
          {loggedInUserId === postOwnerId && (
            <div className="delete-post">
              <button
                onClick={() => {
                  setDeleteModalVisible(true);
                  setDeleteTarget(null);
                }}
                aria-label="Delete Post"
                className="delete-post-button"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          )}

          {/* Display Post Owner Username */}
          <div className="comment-popup-username">
            <p>{postOwnerUsername || "Unknown User"}</p>
          </div>

          {/* Post Image */}
          <div className="comment-post-image-container">
            {postImage && (
              <img
                src={postImage.startsWith("http") ? postImage : `${apiUrl}/${postImage}`}
                alt="Post"
                className="comment-post-image"
              />
            )}
          </div>

          {/* Header */}
          <div className="popUpCommentHeader">
            <h2>Comments</h2>
          </div>

          {/* Comments Section */}
          <div className="comment-popup-content">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <div className="comment-header">
                    <strong>{comment.user_id?.username || "Anonymous"}</strong> -{" "}
                    {new Date(comment.createdAt).toLocaleString("en-UK", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <p className="comment-content">{comment.content}</p>

                  {/* Delete Comment Button */}
                  {(loggedInUserId === postOwnerId || loggedInUserId === comment?.user_id) && (
                    <div className="delete-comment">
                      <button
                        onClick={() => {
                          setDeleteModalVisible(true);
                          setDeleteTarget(comment._id);
                        }}
                        aria-label="Delete Comment"
                        className="delete-comment-button"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-comments-message">No comments yet. Be the first to comment!</p>
            )}
          </div>

          {/* Comment Input */}
          <div className="comment-input">
            <input
              type="text"
              placeholder="Write your comment here..."
              value={commentSelectedText}
              onChange={(e) => setCommentSelectedText(e.target.value)}
            />
          </div>

          <div className="comment-buttons">
            {/* Submit Button */}
            <div className="submit-comment">
              <button onClick={handleSubmit} disabled={popupCommentSubmitting}>
                {popupCommentSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>

            {/* Close Button */}
            <div className="comment-close-button">
              <button onClick={closePopupComment} className="close-comment-button">
                Close
              </button>
            </div>
          </div>


          {/* Like Section */}
          <div>
            <LikeSection
              liked={liked}
              toggleLike={toggleLike}
              likeCount={likeCount}
              postId={postId}
              pageType={pageType}
            />
          </div>
        </div>

        {/* Delete Modal */}
        {deleteModalVisible && (
          <DeleteModal
            isVisible={deleteModalVisible}
            onClose={() => setDeleteModalVisible(false)}
            onConfirm={confirmDelete}
            title={deleteTarget ? "Confirm Delete Comment" : "Confirm Delete Post"}
            description={
              deleteTarget
                ? "Are you sure you want to delete this comment? This cannot be undone."
                : "Are you sure you want to delete this post? This cannot be undone."
            }
          />
        )}
      </div>
    )
  );

};

export default CommentPopup;
