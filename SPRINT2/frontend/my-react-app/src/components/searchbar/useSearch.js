import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const useSearch = (initialValue = '', onSearch, navigate) => {
  const { simulateTestMode } = useTestModeInstance();
  const [searchTerm, setSearchTerm] = useState(initialValue);

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

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    if (simulateTestMode) {
      simulateTestMode("Simulating search");
      // Additional logic...
    }
  }, [simulateTestMode]);

  return [searchTerm, setSearchTerm, handleKeyPress];
};

export default useSearch;