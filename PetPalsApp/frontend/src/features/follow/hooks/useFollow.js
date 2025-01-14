import { useState, useEffect } from "react";

const useFollow = (username) => {
  // State Management
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || "/api";
  const accessToken = localStorage.getItem("accessToken");

  // Fetch Follow Data
  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/${username}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setIsFollowing(userData.isFollowing);
          setFollowerCount(userData.followersCount || 0);
          setFollowingCount(userData.followingCount || 0);
        } else {
          console.error("Failed to fetch follow data:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching follow data:", error.message);
      }
    };

    fetchFollowData();
  }, [username, apiUrl, accessToken]);

  // Follow User
  const followUser = async () => {
    setIsLoading(true);
    setIsFollowing(true); // Optimistically update
    setFollowerCount((prevCount) => prevCount + 1); // Optimistically update count
  
    try {
      const response = await fetch(`${apiUrl}/users/${username}/follow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const updatedData = await response.json();
        setFollowerCount(updatedData.followers || 0); // Adjust based on actual response
        return true;
      } else {
        throw new Error("Failed to follow user");
      }
    } catch (error) {
      console.error("Error following user:", error.message);
      setIsFollowing(false); // Revert if failed
      setFollowerCount((prevCount) => prevCount - 1); // Revert follower count
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Unfollow User
  const unfollowUser = async () => {
    setIsLoading(true);
    setIsFollowing(false); // Optimistically update
    setFollowerCount((prevCount) => prevCount - 1); // Optimistically update count
  
    try {
      const response = await fetch(`${apiUrl}/users/${username}/follow`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const updatedData = await response.json();
        setFollowerCount(updatedData.followers || 0); // Adjust based on actual response
        return true;
      } else {
        throw new Error("Failed to unfollow user");
      }
    } catch (error) {
      console.error("Error unfollowing user:", error.message);
      setIsFollowing(true); // Revert if failed
      setFollowerCount((prevCount) => prevCount + 1); // Revert follower count
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isFollowing, followerCount, followingCount, followUser, unfollowUser, isLoading };
};

export default useFollow;
