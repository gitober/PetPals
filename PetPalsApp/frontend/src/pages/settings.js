import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sanitizeImageUrl from "../utils/sanitizeImageUrl";

import SearchBar from "../features/search-bar/components/SearchBar";
import SearchResults from "../features/search-bar/components/SearchResults";
import Sidebar from "../features/sidebar/components/Sidebar";
import PostPopup from "../features/posting/components/PostPopup";
import BackToTop from "../features/back-to-top/components/BackToTop";
import SettingsPopup from "../features/settings/components/SettingsPopup";
import ChangePasswordPopup from "../features/settings/components/ChangePasswordPopup";

import useSettings from "../features/settings/hooks/useSettings";
import useSearch from "../features/search-bar/hooks/useSearch";

import "../style/settings.css";
import "../style/search-bar.css";
import "../style/sidebar.css";
import "../style/back-to-top.css";

const Settings = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || "/api";

  // User Settings Hooks
  const {
    username,
    bioText,
    profilePicture,
    setProfilePicture,
    handleProfilePictureChange,
    handleUsernameChange,
    handleBioChange,
    handlePasswordChange,
    fetchUserProfile,
  } = useSettings(apiUrl, navigate);

  // Search Functionality Hooks
  const {
    searchTerm,
    setSearchTerm,
    handleKeyPress,
    searchResults,
    isLoading,
    error,
    clearSearchTerm,
  } = useSearch("", (term) => console.log(`Searching for: ${term}`), navigate);

  // Local State
  const [localBio, setLocalBio] = useState(bioText); // Tracks bio changes locally
  const [popupVisible, setPopupVisible] = useState(false); // General settings popup visibility
  const [popupConfig, setPopupConfig] = useState({}); // Settings popup configuration
  const [popupPostVisible, setPopupPostVisible] = useState(false); // Post popup visibility
  const [passwordPopupVisible, setPasswordPopupVisible] = useState(false); // Password popup visibility

  const localStorageKey = `userProfile_${username}`; // Key for saving to localStorage

  // Fetch User Profile on Component Load
  useEffect(() => {
    const storedProfile = localStorage.getItem(localStorageKey);
    if (storedProfile) {
      const { bioText: storedBioText } = JSON.parse(storedProfile);
      setLocalBio(storedBioText || bioText); // Use stored bio if available
    } else {
      fetchUserProfile(); // Fetch from API if not stored
    }
  }, [fetchUserProfile, localStorageKey, bioText]);

  // Save Profile Data to Local Storage
  const saveProfileToLocalStorage = (username, bio, picture) => {
    if (!username) {
      console.error("Username is required to save profile data to localStorage.");
      return;
    }
    const profileData = { bioText: bio || "", profilePicture: picture || "" };
    localStorage.setItem(localStorageKey, JSON.stringify(profileData));
  };

  // Handle Profile Picture Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const updatedPicture = await handleProfilePictureChange(file);
    if (updatedPicture) {
      setProfilePicture(updatedPicture); // Update profile picture state
    }
  };

  // Open Password Change Popup
  const openPasswordPopup = () => {
    setPasswordPopupVisible(true);
  };

  // Open General Settings Popup
  const openSettingsPopup = (title, placeholder, defaultValue, type, onSave) => {
    setPopupConfig({ title, placeholder, defaultValue, type, onSave });
    setPopupVisible(true);
  };

  // Open Post Popup and Navigate to Profile
  const openPopupPost = () => {
    setPopupPostVisible(true);
    navigate("/profile");
  };

  return (
    <div className="settings-page-container">
      <BackToTop />
      <Sidebar openPopupPost={openPopupPost} />
      <div className="settings-main-content">
        <div className="search-bar">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleKeyPress={handleKeyPress}
          />
          <SearchResults
            isLoading={isLoading}
            error={error}
            searchResults={searchResults}
            searchTerm={searchTerm}
            clearSearchTerm={clearSearchTerm}
          />
        </div>
        <div className="settings-feed">
          <h1>Settings</h1>
          <div className="settings-grid">
            {/* Profile Picture */}
            <div className="settings-item profile">
              <input
                type="file"
                id="profilePictureInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <label htmlFor="profilePictureInput">
                <img
                  className="settings-profilepicture"
                  src={sanitizeImageUrl(profilePicture, apiUrl) || "/placeholder-image.png"}
                  alt="Profile"
                />
              </label>
              <button
                className="settings-button"
                onClick={() => document.getElementById("profilePictureInput").click()}
              >
                Change Profile Picture
              </button>
            </div>

            {/* Username */}
            <div className="settings-item">
              <div className="settings-text">{username}</div>
              <button
                className="settings-button"
                onClick={() =>
                  openSettingsPopup(
                    "Change Username",
                    "New Username",
                    username,
                    "text",
                    async (newUsername) => {
                      if (newUsername && newUsername.trim()) {
                        await handleUsernameChange(newUsername);
                      }
                    }
                  )
                }
              >
                Change Username
              </button>
            </div>

            {/* Bio */}
            <div className="settings-item">
              <div className="settings-text">{localBio || "Add a bio"}</div>
              <button
                className="settings-button"
                onClick={() =>
                  openSettingsPopup(
                    "Edit Bio",
                    "Your bio",
                    localBio,
                    "text",
                    (newBio) => {
                      if (newBio && newBio.trim()) {
                        setLocalBio(newBio);
                        handleBioChange(newBio);
                        saveProfileToLocalStorage(username, newBio, profilePicture);
                      }
                    }
                  )
                }
              >
                Edit Bio
              </button>
            </div>

            {/* Password */}
            <div className="settings-item">
              <div className="settings-text">{"*******"}</div>
              <button className="settings-button" onClick={openPasswordPopup}>
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
      {popupPostVisible && (
        <PostPopup
          visible={popupPostVisible}
          onClose={() => setPopupPostVisible(false)}
        />
      )}
      {popupVisible && (
        <SettingsPopup
          title={popupConfig.title}
          placeholder={popupConfig.placeholder}
          defaultValue={popupConfig.defaultValue}
          type={popupConfig.type}
          onSave={popupConfig.onSave}
          onClose={() => setPopupVisible(false)}
        />
      )}
      {passwordPopupVisible && (
        <ChangePasswordPopup
          onSave={async (oldPassword, newPassword) =>
            handlePasswordChange(oldPassword, newPassword)
          }
          onClose={() => setPasswordPopupVisible(false)}
        />
      )}
    </div>
  );
};

export default Settings;
