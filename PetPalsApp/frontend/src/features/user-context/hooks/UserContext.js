import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsernameState] = useState("");
  const [bioText, setBioText] = useState("");
  const [profilePicture, setProfilePicture] = useState("/placeholder-image.png");
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false); 
  const apiUrl = process.env.REACT_APP_API_URL || "/api";

  // Custom function to sync username to localStorage and state
  const setUsername = (newUsername) => {
    setUsernameState(newUsername); // Update the state
    localStorage.setItem("username", newUsername); // Sync with `username` key
    localStorage.setItem("currentUsername", newUsername); // Sync with `currentUsername` key
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (loggedOut) {
        // Exit the effect if the user has logged out
        return;
      }

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        if (!loggedOut) {
          console.warn("Access token not found. Redirecting to login...");
        }
        setLoading(false);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          console.error(`Error fetching user data: ${response.status}`);
          if (response.status === 401) {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
          }
          throw new Error(response.statusText);
        }

        const userData = await response.json();
        setUsername(userData.username || "Unknown User");
        setBioText(userData.bioText || "Welcome to my page!");

        if (userData.profilePicture) {
          const sanitizedProfilePicture = `${apiUrl}/${userData.profilePicture.replace(/\\/g, "/")}`;
          setProfilePicture(sanitizedProfilePicture);
          localStorage.setItem("profilePicture", sanitizedProfilePicture);
        } else {
          const savedProfilePicture = localStorage.getItem("profilePicture");
          setProfilePicture(savedProfilePicture || "/placeholder-image.png");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [apiUrl, loggedOut]);

  useEffect(() => {
    const savedProfilePicture = localStorage.getItem("profilePicture");
    if (savedProfilePicture) {
      setProfilePicture(savedProfilePicture);
    }
  }, []);

  // Function to handle logout and set the loggedOut state
  const handleLogout = () => {
    setLoggedOut(true); // Mark the user as logged out
    localStorage.clear(); // Clear localStorage
    window.location.href = "/login"; // Redirect to login
  };

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        setUsername,
        bioText,
        setBioText,
        profilePicture,
        setProfilePicture,
        loading,
        handleLogout, 
      }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
};
