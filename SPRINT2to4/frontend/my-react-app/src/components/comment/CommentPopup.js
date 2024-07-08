import React from 'react';

const CommentPopup = ({
  popupCommentVisible,
  closePopupComment,
  currentImage,
  comments,
  commentSelectedText,
  setCommentSelectedText,
  submitComment,
  popupCommentSubmitting
}) => (
  <div
    className="comment-popup"
    style={{ display: popupCommentVisible ? "block" : "none" }}
  >
    <div>
      <span className="close" onClick={closePopupComment}>
        &times;
      </span>
    </div>
    <div className="preview-image-container">
      {currentImage && (
        <img src={currentImage} alt="Selected" className="preview-image" />
      )}
    </div>
    <div className="popUpCommentHeader">
      <h2>Comments</h2>
    </div>
    <div className="comment-popup-content">
      {comments.map((comment, index) => (
        <div key={index} className="comment">
          <strong>{comment.username}</strong> - {new Date(comment.date).toLocaleDateString()}
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
    <div className="comment-input">
      <input
        type="text"
        placeholder="Write your comment here..."
        value={commentSelectedText}
        onChange={(e) => setCommentSelectedText(e.target.value)}
      />
    </div>
    <div className="submit-comment">
      <button onClick={submitComment} disabled={popupCommentSubmitting}>
        {popupCommentSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  </div>
);

export default CommentPopup;
