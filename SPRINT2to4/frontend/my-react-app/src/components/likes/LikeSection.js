import React from 'react';

const LikeSection = ({ liked, toggleLike, imageUrl, likeCount, postId }) => (
  <div className="like-container">
    <img
      src={liked ? "../img/liked.png" : "../img/like.png"}
      alt={liked ? "Image Liked" : "Image Not Liked"}
      className="like-icon"
      onClick={() => toggleLike(imageUrl, postId)}
    />
    <div className="likes-container">
      <p className="likes">
        likes{" "}
        <span>
          {likeCount !== undefined ? likeCount : 0}
        </span>
      </p>
    </div>
  </div>
);

export default LikeSection;
