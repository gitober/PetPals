import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import "../style/home.css";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/popuppost.css";
import "../style/popupcomment.css";

function Home() {
  const [feedItems, setFeedItems] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const [postPopupVisible, setPostPopupVisible] = useState(false);
  const [commentPopupVisible, setCommentPopupVisible] = useState(false);
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [likedImages, setLikedImages] = useState([]); // State for storing liked images


  const backendIsRunning = false;
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const isTestMode = !backendIsRunning;

  const simulateTestMode = (message, additionalData) => {
    if (isTestMode) {
      console.log(`Test mode: ${message}`);
      if (additionalData) {
        console.log("Additional Data:", additionalData);
      }
      // Add any test mode behavior if needed
    }
  };

  const refreshAccessToken = async (currentToken) => {
    try {
      if (isTestMode) {
        console.log("Test mode: Simulating successful token refresh");
        window.location.href = "../home";
      } else {
        const refreshResponse = await fetch(`${apiUrl}/api/refresh_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
        });
        // Rest of the function remains the same
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
    }
  };

  const fetchInitialPosts = async (token) => {
    try {
      if (!token) {
        await refreshAccessToken(token);
        return;
      }

      const url = `/api/posts`;
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      if (isTestMode && feedItems.length === 0) {
        // Simulate a successful response in test mode
        const newPost = {
          id: Math.random().toString(),
          images: [],
          content: "",
        };

        setFeedItems((prevItems) => [newPost, ...prevItems]);
        return;
      }

      const response = await fetch(url, config);

      if (response.ok) {
        const data = await response.json();
        setFeedItems((prevItems) => [...prevItems, ...data.posts]);
        console.log("Updated Feed Items:", feedItems);
      } else {
        console.error(
          "Failed to fetch posts:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error during initial post fetch:", error.message);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    console.log("Stored Token:", storedToken);
    setToken(storedToken || "");

    if (token && selectedImages.length === 0) {
      fetchInitialPosts(token);
    }
  }, [token, selectedImages]);

   const toggleLike = (imageUrl) => {
     setLikeCounts((prevLikeCounts) => {
       const updatedLikeCounts = { ...prevLikeCounts };
       updatedLikeCounts[imageUrl] = updatedLikeCounts[imageUrl] ? 0 : 1;
       return updatedLikeCounts;
     });

     setLikedImages((prevLikedImages) => {
       const updatedLikedImages = { ...prevLikedImages };
       updatedLikedImages[imageUrl] = !prevLikedImages[imageUrl];
       return updatedLikedImages;
     });
   };


  const openPostPopup = () => {
    setPostPopupVisible(true);
    simulateTestMode("Opening post popup");
  };

  const closePostPopup = () => {
    setPostPopupVisible(false);
    setSelectedImages([]);
    setSelectedText("");
    simulateTestMode("Closing post popup");
  };

  const openCommentPopup = (imageUrl) => {
    setSelectedImages([imageUrl]);
    setCommentPopupVisible(true);
    simulateTestMode("Opening comment popup");
  };

  const closeCommentPopup = () => {
    setCommentPopupVisible(false);
    simulateTestMode("Closing comment popup");
  };

  const handleSubmit = async () => {
    console.log("Inside handleSubmit");
    console.log("Access Token:", token);
    console.log("Selected Images:", selectedImages);

    if (selectedImages.length === 0) {
      console.error("No image selected for submission.");
      return;
    }

    try {
      setSubmitting(true);

      // Make sure your backend expects the "images" field for file uploads
      const formData = new FormData();
      selectedImages.forEach((image, index) => {
        formData.append(`images[${index}]`, image); // Use unique keys for each image
      });

      // Add text content
      formData.append("content", selectedText);

      if (isTestMode) {
        console.log("Test mode: Simulating successful post submission");
        console.log("Test mode: Closing post popup");

        // Simulate the new post in the local state
        const newPost = {
          id: Math.random().toString(), // Unique identifier (replace this with your actual ID logic)
          images: selectedImages.map((image) => image),
          content: selectedText,
          // Add other necessary fields
          comments: [], // Add an empty array for comments
        };

        // Update selectedImages to an empty array
        setSelectedImages([]);

        // Log the new post data
        console.log("New Post Data:", newPost);

        // Set the new post in the local state
        setFeedItems((prevFeedItems) => [newPost, ...prevFeedItems]);

        // Close the post popup after successful submission
        closePostPopup();
      } else {
        // Actual API request logic for non-test mode
        const formData = new FormData();
        selectedImages.forEach((image, index) => {
          formData.append(`images[${index}]`, image); // Use unique keys for each image
        });
        formData.append("content", selectedText);

        const response = await fetch(`/api/posts`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          // Call fetchInitialPosts or update the local state as needed
          fetchInitialPosts(token); // Assuming fetchInitialPosts fetches posts from the API
          closePostPopup();
        } else {
          console.error(
            "Failed to submit post:",
            response.status,
            response.statusText
          );
        }
      }
    } catch (error) {
      console.error("Error during post submission:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const newImages = Array.from(files);

      if (isTestMode) {
        // Simulate test mode behavior by creating URLs directly
        const imageUrls = newImages.map((image) =>
          URL.createObjectURL(new Blob([image]))
        );
        setSelectedImages(imageUrls);
      } else {
        // In non-test mode, create URLs for the selected images
        const imageUrls = newImages.map((image) =>
          URL.createObjectURL(new Blob([image]))
        );
        setSelectedImages(imageUrls);
      }
    }
  };

  useEffect(() => {
    // Log the updated selected images for debugging
    console.log("Updated Selected Images:", selectedImages);

    // If you want to trigger additional actions in test mode, you can do it here
    if (isTestMode) {
      console.log("Test mode: Additional actions after image selection");
      // Add any test mode behavior after updating selected images
    }

    // Cleanup the created URLs when the component unmounts or when the selectedImages change
    return () => {
      if (!isTestMode) {
        selectedImages.forEach((imageUrl) => URL.revokeObjectURL(imageUrl));
      }
    };
  }, [selectedImages, isTestMode]);

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
          // Add other necessary fields
        };

        // Update the local state to simulate the new comment
        setFeedItems((prevFeedItems) =>
          prevFeedItems.map((item) =>
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
        selectedImages.forEach((image, index) => {
          formData.append(`image${index}`, image);
        });
        formData.append("content", selectedText);

        const response = await fetch(`/api/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            image: selectedImages[0],
            content: selectedText,
          }),
        });

        if (response.ok) {
          const responseData = await response.json();

          setFeedItems((prevFeedItems) =>
            prevFeedItems.map((item) =>
              item.id === responseData.postId
                ? { ...item, comments: responseData.comments }
                : item
            )
          );

          closeCommentPopup(); // Close the comment popup after successful submission
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

  return (
    <Layout>
      <div className="home-page-container">
        <div className="sidebar">
          <img srcSet="/img/navbar.png" alt="logo" />
          <ul>
            <li>
              <a href="../home">HOME</a>
            </li>
            <li>
              <a href="../profile">PROFILE</a>
            </li>
            <li>
              <a onClick={openPostPopup}>POST</a>
            </li>
            <li>
              <a href="../settings">SETTINGS</a>
            </li>
          </ul>
          <div className="logout">
            <a href="/login">Log Out</a>
          </div>
        </div>
        <div className="home-main-content">
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>
          <div className="home-feed">
            {feedItems.map((item, index) => (
              <div key={index} className="feed-item">
                <a href="../userprofile">
                  <h3>username</h3>
                </a>
                <img src={item.images[0]} alt={`User's Post ${index}`} />
                <div className="icons">
                  <div className="like-container">
                    {/* Conditional rendering of like icon based on liked status */}
                    {likedImages[item.images[0]] ? (
                      <img
                        src="../img/liked.png"
                        alt="Liked"
                        className="like-icon"
                        id={`likeIcon-${index}`}
                        onClick={() => toggleLike(item.images[0])}
                      />
                    ) : (
                      <img
                        src="../img/like.png"
                        alt="Like"
                        className="like-icon"
                        id={`likeIcon-${index}`}
                        onClick={() => toggleLike(item.images[0])}
                      />
                    )}
                  </div>
                  {/* Comment icon */}
                  <img
                    src="../img/comment.png"
                    alt="Comment"
                    className="icon"
                    onClick={() => openCommentPopup(item.images[0])}
                  />
                  <div className="likes-container">
                    {/* Display like count */}
                    <p className="likes">
                      likes{" "}
                      <span id={`likeCount-${index}`}>
                        {likeCounts[item.images[0]] || 0}
                      </span>
                    </p>
                  </div>
                </div>
                <p>{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="postpopup"
        style={{ display: postPopupVisible ? "block" : "none" }}
      >
        <span className="closePostPopup" onClick={closePostPopup}>
          &times;
        </span>
        <div className="post-popup-content">
          <div className="content-wrapper">
            <h2>Add a new picture</h2>
            <div className="empty-area">
              {selectedImages.length === 1 && (
                <div className="postPicAndComment">
                  <img
                    src={selectedImages[0]}
                    alt="Selected"
                    className="preview-image"
                  />
                  <input
                    type="text"
                    value={selectedText}
                    onChange={(e) => setSelectedText(e.target.value)}
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
                onClick={(e) => (e.target.value = null)} // This line allows selecting the same file again
              />
              <button
                className="post-select-button"
                onClick={() => document.getElementById("fileInput").click()}
              >
                Drag here or Select from computer
              </button>
            </div>
          </div>
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
      <div
        className="comment-popup"
        style={{ display: commentPopupVisible ? "block" : "none" }}
      >
        <div>
          <span className="close" onClick={closeCommentPopup}>
            &times;
          </span>
        </div>
        <div className="preview-image-container">
          {selectedImages.length === 1 && (
            <img
              src={selectedImages[0]}
              alt="Selected"
              className="preview-image"
            />
          )}
        </div>
        <div className="popUpCommentHeader">
          <h2>Comments</h2>
        </div>
        <div className="comment-popup-content">
          {/* Comments will be displayed here */}
          {feedItems
            .filter(
              (item) => item.images && item.images.includes(selectedImages[0])
            )
            .map((item, index) => (
              <div key={index} className="comment">
                {item.comments &&
                  item.comments.map((comment, idx) => (
                    <div key={idx}>{comment.content}</div>
                  ))}
              </div>
            ))}
        </div>
        <div className="comment-input">
          <input
            type="text"
            placeholder="Write your comment here..."
            value={selectedText}
            onChange={(e) => setSelectedText(e.target.value)}
          />
        </div>
        <div className="submit-comment">
          <button onClick={submitComment} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
