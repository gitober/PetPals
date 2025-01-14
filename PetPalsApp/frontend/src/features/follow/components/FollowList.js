import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../user-context/hooks/UserContext";

const FollowList = ({
  apiUrl = process.env.REACT_APP_API_URL || "/api", // Default value if not passed
  accessToken,
  type,
}) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const { username: loggedInUsername } = useContext(UserContext);
  const navigate = useNavigate();

  const handleUsernameClick = (username, userId) => {
    if (userId === loggedInUsername) {
      navigate("/profile");
    } else {
      navigate(`/userprofile/${username}`);
    }
  };

  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        if (!loggedInUsername) {
          console.error("Logged-in username not found");
          return;
        }

        const response = await fetch(`${apiUrl}/users/${loggedInUsername}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setList(type === "followers" ? data.followers : data.following);
        } else {
          console.error("Failed to fetch follow data:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching follow data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowData();
  }, [apiUrl, loggedInUsername, accessToken, type]);

  if (loading) {
    return <p>Loading {type}...</p>;
  }

  if (!list.length) {
    return <p>No {type} yet.</p>;
  }

  const containerHeight = 60;
  const maxVisibleItems = Math.floor((window.innerHeight - 200) / containerHeight);
  const visibleItems = isExpanded ? list : list.slice(0, maxVisibleItems);
  const overflowCount = list.length - visibleItems.length;

  return (
    <div className="follow-list">
      <h3>{type === "followers" ? "Followers" : "Following"}</h3>
      <ul>
        {visibleItems.map((user) => (
          <li key={user._id} className="follow-item">
            <img
              src={user.profilePicture || "/placeholder-image.png"}
              alt={`${user.username}'s profile`}
              className="follow-profile-picture"
              onError={(e) => (e.target.src = "/placeholder-image.png")}
            />
            <span
              className="follow-username"
              onClick={() => handleUsernameClick(user.username, user._id)}
            >
              {user.username}
            </span>
          </li>
        ))}
      </ul>
      {overflowCount > 0 && !isExpanded && (
        <div
          className="follow-list-overflow"
          onClick={() => setIsExpanded(true)}
          style={{ cursor: "pointer" }}
        >
          +{overflowCount} more
        </div>
      )}
    </div>
  );
};

export default FollowList;
