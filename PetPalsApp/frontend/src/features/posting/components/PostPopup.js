import React, { useState, useEffect, useRef } from "react";

const PostPopup = ({
  popupPostVisible,
  closePopupPost,
  postText = "",
  handleChange,
  postSelectedImages = [],
  handleFileChange,
  handleSubmit,
  postSubmitting,
}) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Prevent background scrolling
  useEffect(() => {
    if (popupPostVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [popupPostVisible]);

  // Close modal on clicking outside
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closePopupPost();
    }
  };

  useEffect(() => {
    if (popupPostVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [popupPostVisible]);

  // Reset Image Preview and File Input
  useEffect(() => {
    if (!popupPostVisible) {
      setImagePreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [popupPostVisible]);

  // Update Image Preview
  useEffect(() => {
    if (postSelectedImages.length > 0) {
      const objectUrl = URL.createObjectURL(postSelectedImages[0]);
      setImagePreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
        setImagePreviewUrl(null);
      };
    }
  }, [postSelectedImages]);

  // Render Post Popup
  return (
    popupPostVisible && (
      <div className="post-popup-overlay">
        <div
          className="postpopup"
          ref={modalRef} // Attach the ref to the modal container
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="closePostPopup" onClick={closePopupPost}>
            &times;
          </span>
          <div className="post-popup-content">
            <div className="add-picture-header">
              <h2>Add a new post</h2>
            </div>
            <div>
              {imagePreviewUrl ? (
                <div className="postPicAndComment">
                  <img
                    src={imagePreviewUrl}
                    alt="Selected preview"
                    className="post-preview-image"
                  />
                  <input
                    type="text"
                    value={postText}
                    onChange={handleChange}
                    placeholder="Enter your text here"
                    className="post-text-input"
                  />
                </div>
              ) : (
                <p>No image selected</p>
              )}
              <div className="post-file-input-container">
                <label htmlFor="fileInput" className="post-file-input-label">
                  Select from computer
                </label>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  className="post-file-input"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </div>
            </div>
            <button
              className="post-submit-button"
              onClick={handleSubmit}
              disabled={postSubmitting || postSelectedImages.length === 0}
            >
              {postSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default PostPopup;
