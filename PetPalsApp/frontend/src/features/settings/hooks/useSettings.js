import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../user-context/hooks/UserContext";
import sanitizeImageUrl from "../../../utils/sanitizeImageUrl";

const useSettings = () => {
  const apiUrl = process.env.REACT_APP_API_URL || "/api";
  const accessToken = localStorage.getItem("accessToken");

  const {
    username,
    setUsername,
    bioText,
    setBioText,
    profilePicture,
    setProfilePicture,
  } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const localStorageKey = `userProfile_${username}`;

  const saveProfileToLocalStorage = (bio, picture) => {
    const profileData = {
      bioText: bio || "",
      profilePicture: picture || "/placeholder-image.png",
    };
    localStorage.setItem(localStorageKey, JSON.stringify(profileData));
  };

  const fetchUserProfile = async () => {
    if (!accessToken || !username) {
      setStatusMessage("Access token or username is missing.");
      setStatusType("error");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/users/${username}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setBioText(userData.bioText || "");
        const sanitizedPicture = sanitizeImageUrl(userData.profilePicture, apiUrl);
        setProfilePicture(sanitizedPicture || "");
        saveProfileToLocalStorage(userData.bioText, sanitizedPicture);
      } else {
        setStatusMessage("Failed to fetch user profile data.");
        setStatusType("error");
      }
    } catch (error) {
      setStatusMessage("Error fetching user profile.");
      setStatusType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureChange = async (file) => {
    if (!file) {
      setStatusMessage("No file selected for upload.");
      setStatusType("error");
      return null;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await fetch(`${apiUrl}/users/${username}/profile-picture`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.profilePicture) {
          const sanitizedPicture = sanitizeImageUrl(data.profilePicture, apiUrl);
          setProfilePicture(sanitizedPicture);
          saveProfileToLocalStorage(bioText, sanitizedPicture);
          setStatusMessage("Profile picture updated successfully!");
          setStatusType("success");
          return sanitizedPicture;
        }
      } else {
        setStatusMessage("Failed to update profile picture.");
        setStatusType("error");
      }
    } catch (error) {
      setStatusMessage("Error updating profile picture.");
      setStatusType("error");
    }

    return null;
  };

  const handleUsernameChange = async (newUsername) => {
    if (!newUsername || !newUsername.trim()) {
      setStatusMessage("Please enter a valid username.");
      setStatusType("error");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/users/${username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ newUsername }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        const newLocalStorageKey = `userProfile_${newUsername}`;
        localStorage.setItem(
          newLocalStorageKey,
          JSON.stringify({
            bioText: updatedUser.bioText,
            profilePicture: updatedUser.profilePicture,
          })
        );
        localStorage.removeItem(localStorageKey);
        setUsername(newUsername);
        setStatusMessage("Username updated successfully!");
        setStatusType("success");
      } else {
        const errorText = await response.text();
        console.error(`Failed to update username: ${response.status}`, errorText);
        setStatusMessage("Failed to update username. Please try again.");
        setStatusType("error");
      }
    } catch (error) {
      setStatusMessage("An error occurred while updating the username.");
      setStatusType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBioChange = async (newBioText) => {
    if (!newBioText || !newBioText.trim() || !accessToken) {
      setStatusMessage("Bio text must be valid.");
      setStatusType("error");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/users/${username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ bioText: newBioText }),
      });

      if (response.ok) {
        setBioText(newBioText);
        saveProfileToLocalStorage(newBioText, profilePicture);
        setStatusMessage("Bio updated successfully!");
        setStatusType("success");
      } else {
        setStatusMessage("Failed to update bio.");
        setStatusType("error");
      }
    } catch (error) {
      setStatusMessage("Error updating bio.");
      setStatusType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Validate Current Password
  const validateCurrentPassword = async (password) => {
    try {
      const response = await fetch(`${apiUrl}/users/validate-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Pass token for authenticated user
        },
        body: JSON.stringify({ password }),
      });
  
      if (response.ok) {
        return { isValid: true }; // Password is valid
      } else {
        const errorData = await response.json();
        return { isValid: false, errorMessage: errorData.error || "Old password does not match." };
      }
    } catch (error) {
      console.error("Error validating password:", error);
      return { isValid: false, errorMessage: "An error occurred while validating the password." };
    }
  };
  

  // Handle Password Change
  const handlePasswordChange = async (currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
      setStatusMessage("Both current and new passwords are required.");
      setStatusType("error");
      return false; // Indicate failure
    }
  
    if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setStatusMessage(
        "New password must be at least 8 characters long and include letters and numbers."
      );
      setStatusType("error");
      return false; // Indicate failure
    }
  
    // Validate the current password before proceeding
    const validation = await validateCurrentPassword(currentPassword);
    if (!validation.isValid) {
      setStatusMessage(validation.errorMessage);
      setStatusType("error");
      return false; // Indicate failure
    }
  
    // If validation passes, attempt to update the password
    try {
      const response = await fetch(`${apiUrl}/users/${username}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
  
      if (response.ok) {
        const data = await response.json(); // Parse response JSON
        setStatusMessage(data.message || "Password updated successfully!");
        setStatusType("success");
        return true; // Indicate success
      } else {
        const errorData = await response.json(); // Parse error JSON
        setStatusMessage(errorData.error || "Failed to update password.");
        setStatusType("error");
        return false; // Indicate failure
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setStatusMessage("An error occurred. Please try again.");
      setStatusType("error");
      return false; // Indicate failure
    }
  };  

  useEffect(() => {
    const storedProfile = localStorage.getItem(localStorageKey);
    if (storedProfile) {
      const { bioText: storedBio, profilePicture: storedPicture } = JSON.parse(storedProfile);
      if (storedBio) setBioText(storedBio);
      if (storedPicture) setProfilePicture(storedPicture);
    } else {
      fetchUserProfile();
    }
  }, [localStorageKey, profilePicture]);

  return {
    isLoading,
    statusMessage,
    statusType,
    username,
    bioText,
    profilePicture,
    setProfilePicture,
    handleProfilePictureChange,
    handleUsernameChange,
    handleBioChange,
    handlePasswordChange,
    fetchUserProfile,
    validateCurrentPassword,
  };
};

export default useSettings;
