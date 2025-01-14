import React from "react";

const LikeSection = ({ liked, toggleLike, likeCount, postId, handleCommentClick, pageType }) => {
  // Render Interaction Section
  return (
    <>
      {pageType !== "home" && (
        <div className="interaction-container">
          <img
            src={liked ? "../img/liked.png" : "../img/like.png"}
            alt={liked ? "Liked" : "Not Liked"}
            className="like-icon"
            onClick={() => toggleLike(postId)}
          />
          <p className="likes">
            Likes <span>{likeCount || 0}</span>
          </p>
          {/* Conditionally render the comment icon */}
          {pageType !== "profile" && pageType !== "userprofile" && (
            <img
              src="../img/comment.png"
              alt="Comment"
              className="comment-icon"
              onClick={handleCommentClick}
            />
          )}
        </div>
      )}
    </>
  );
};

export default LikeSection;
