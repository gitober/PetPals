import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const useSearch = (initialValue = '', onSearch) => {
  const { simulateTestMode } = useTestModeInstance(); // Use useTestModeInstance


  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  // Now you can use simulateTestMode within the useEffect or wherever needed

  useEffect(() => {
    if (simulateTestMode) {
      simulateTestMode("Simulating search");
      // Additional logic...
    }
  }, [simulateTestMode]);

  return [searchTerm, setSearchTerm];
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchTerm);
      if (searchTerm.toLowerCase() === "home") {
        navigate("../home");
      } else if (searchTerm.toLowerCase() === "profile") {
        navigate("../profile");
      } else if (searchTerm.toLowerCase() === "settings") {
        navigate("../settings");
      } else if (searchTerm.toLowerCase() === "post") {
        navigate("../post");
      } else if (searchTerm.toLowerCase() === "userprofile") {
        navigate("../userprofile");
      }
    }
  };

  return [searchTerm, setSearchTerm, handleKeyPress];
};

export default useSearch;