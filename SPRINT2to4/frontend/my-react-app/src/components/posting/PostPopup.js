import React from 'react';

const PostPopup = ({
  popupPostVisible,
  closePopupPost,
  postText = "", // Ensure a default value is provided
  handleChange,
  postSelectedImages = [], // Ensure postSelectedImages is initialized as an empty array
  handleFileChange,
  handleSubmit,
  postSubmitting,
}) => (
  <div className="postpopup" style={{ display: popupPostVisible ? "block" : "none" }}>
    <span className="closePopupPost" onClick={closePopupPost}>
      &times;
    </span>
    <div className="post-popup-content">
      <div className="content-wrapper">
        <h2>Add a new picture</h2>
        <div className="empty-area">
          {postSelectedImages.length === 1 && ( // Only access length if postSelectedImages is defined
            <div className="postPicAndComment">
              <img src={postSelectedImages[0]} alt="Selected" className="preview-image" />
              <input
                type="text"
                value={postText}
                onChange={handleChange}
                placeholder="Enter your text here"
              />
            </div>
          )}
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="file-input"
            style={{ display: "none" }}
            onChange={handleFileChange}
            onClick={(e) => (e.target.value = null)}
          />
          <button className="post-select-button" onClick={() => document.getElementById("fileInput").click()}>
            Drag here or Select from computer
          </button>
        </div>
      </div>
      <button className="submit-button" onClick={handleSubmit} disabled={postSubmitting}>
        {postSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  </div>
);

export default PostPopup;
