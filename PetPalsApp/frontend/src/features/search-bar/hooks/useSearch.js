import { useState, useEffect } from "react";

const useSearch = (initialValue = '', onSearch) => {
  // State Management
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || "/api";
  const accessToken = localStorage.getItem("accessToken");

  // Fetch Users
  const fetchUsers = async (term) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/users?search=${encodeURIComponent(term)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data); // Update state with fetched users
      } else {
        const errorText = await response.text();
        console.error("Error fetching search results:", errorText);
        setError("Failed to fetch search results");
      }
    } catch (error) {
      console.error("Error during search:", error.message);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Key Press for Search
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && searchTerm.trim()) {
      onSearch(searchTerm);
      fetchUsers(searchTerm);
    }
  };

  // Clear Search Term
  const clearSearchTerm = () => {
    setSearchTerm(''); // Clear search term
    setSearchResults([]); // Clear search results
    setError(null); // Clear any errors
  };

  // Effect for Search Term Changes
  useEffect(() => {
    if (searchTerm.trim()) {
      fetchUsers(searchTerm); // Fetch users when search term changes
    } else {
      setSearchResults([]); // Clear results if search term is empty
    }
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    handleKeyPress,
    isLoading,
    error,
    clearSearchTerm, 
  };
};

export default useSearch;
