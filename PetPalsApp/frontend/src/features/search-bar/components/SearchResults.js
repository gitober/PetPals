import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../../style/search-bar.css";

const SearchResults = ({ isLoading, error, searchResults, searchTerm, clearSearchTerm }) => {
  const navigate = useNavigate();
  const searchResultsRef = useRef(null);

  // Assume the current user's username is stored in local storage or a context
  const currentUsername = localStorage.getItem("username");

  // Handle Username Click
  const handleUsernameClick = (username) => {
    if (username === currentUsername) {
      navigate(`/profile`); // Redirect to the user's own profile
    } else {
      navigate(`/userprofile/${username}`); // Redirect to the specific user's profile
    }
    clearSearchTerm(); // Clear the search term when navigating
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        clearSearchTerm(); // Clear the search term
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clearSearchTerm]);

  // Render Search Results
  return (
    <div ref={searchResultsRef} className={`search-results ${searchTerm ? "show" : ""}`}>
      {isLoading && <p>Loading search results...</p>}
      {error && <p className="error">{error}</p>}
      {Array.isArray(searchResults) && searchResults.length > 0 ? (
        searchResults.map((user) => (
          <div
            key={user._id} // Use user ID as key
            className="user"
            onClick={() => handleUsernameClick(user.username)}
          >
            <p className="clickable-username">{user.username}</p>
          </div>
        ))
      ) : (
        searchTerm &&
        !isLoading && <p>No results found for "{searchTerm}"</p>
      )}
    </div>
  );
};

export default SearchResults;
