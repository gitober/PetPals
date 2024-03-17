import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import useSearch from "../components/searchbar/useSearch";
import "../style/settings.css";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/popuppost.css";
import "../style/popupcomment.css";


function Settings() {
  const [PopupPostVisible, setPopupPostVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const { username, setUsername, bioText, setBioText } =
    useContext(UserContext); // Lisätty bio-tekstin tilat ja funktiot
  const [profilePicture, setProfilePicture] = useState("../img/profiledog.jpg");
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedProfilePicture = localStorage.getItem("profilePicture");
    if (savedUsername) {
      setUsername(savedUsername);
    }
    if (savedProfilePicture) {
      setProfilePicture(savedProfilePicture);
    }
  }, [setUsername]);

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const newProfilePicture = e.target.result;
        setProfilePicture(newProfilePicture);
        localStorage.setItem("profilePicture", newProfilePicture);
      };
      reader.readAsDataURL(file);
    }
  };

  const editUsername = () => {
    const newUsername = prompt("Enter your new username:", username);
    if (newUsername !== null) {
      setUsername(newUsername);
      localStorage.setItem("username", newUsername);
      navigate("/profile");
    }
  };

  const editBioText = () => {
    const newBioText = prompt("Enter your new bio text:", bioText);
    if (newBioText !== null) {
      setBioText(newBioText);
      localStorage.setItem("bioText", newBioText); // Tallenna bio-teksti myös localStorageen
    }
  };

  const changePassword = () => {
    const oldPassword = prompt("Enter your old password:");
    if (oldPassword !== null) {
      const newPassword = prompt("Enter your new password:");
      if (newPassword !== null) {
        alert("Password changed successfully!");
      }
    }
  };

  const openPopupPost = () => {
    setPopupPostVisible(true);
  };

  const closePopupPost = () => {
    setPopupPostVisible(false);
    setSelectedImage(null);
    setSelectedText("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      const newItem = { image: selectedImage, text: selectedText };
      setSelectedImage(null);
      setSelectedText("");
      setPopupPostVisible(false);
    }
  };

  const [searchTerm, setSearchTerm, handleKeyPress] = useSearch('', (term) => {
    // Handle search logic here, if needed
  }, navigate);

  return (
      <div className="settings-page-container">
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
              <a onClick={openPopupPost}>POST</a>
            </li>
            <li>
              <a href="../settings">SETTINGS</a>
            </li>
          </ul>
          <div className="logout">
            <a href="/login">Log Out</a>
          </div>
        </div>

        <div className="settings-main-content">
        <div className="search-bar">
            {/* Use handleKeyPress function to trigger search on Enter key press */}
            <input type="text" placeholder="Search" onKeyPress={handleKeyPress} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="settings-feed">
            <h1>Settings</h1>
            <h2 className="line2"></h2>
            <div className="row">
              <input
                type="file"
                id="profilePictureInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfilePictureChange}
              />
              <label htmlFor="profilePictureInput">
                <img
                  className="dogprofilepicture"
                  src={profilePicture}
                  alt="Profile Picture"
                />
              </label>
              <div className="textbox">{username}</div>
            </div>
            <div className="row">
              <div className="setting-box">
                <label className="profiletext" htmlFor="profilePictureInput">
                  change profile picture
                </label>
              </div>

              <div className="setting-box">
                <h3 onClick={editUsername}>change username</h3>
              </div>
            </div>
            <div className="row">
              <div className="biotextdiv">
                {bioText} {/* Näytä bio-teksti */}
              </div>
              <div className="passtextdiv">
                <p className="passtext">new password</p>
              </div>
            </div>
            <div className="row">
              <div className="setting-box">
                <h3 onClick={editBioText}>edit bio</h3>{" "}
                {/* Lisätty toiminto bio-tekstin muokkaamiseksi */}
              </div>
              <div className="setting-box">
                <h3 onClick={changePassword}>change password</h3>
              </div>
            </div>

            <div
              className="postpopup"
              style={{ display: PopupPostVisible ? "block" : "none" }}
            >
              <span className="closePostPopup" onClick={closePopupPost}>
                &times;
              </span>
              <div className="post-popup-content">
                <div className="content-wrapper">
                  <h2>Add a new picture</h2>
                  <div className="empty-area">
                    {selectedImage && (
                      <div className="postPicAndComment">
                        <img
                          src={selectedImage}
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
                    />
                    <button
                      className="post-select-button"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      Drag here or Select from computer
                    </button>
                  </div>
                </div>
                <button className="submit-button" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Settings;
