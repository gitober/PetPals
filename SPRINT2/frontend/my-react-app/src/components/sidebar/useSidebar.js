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
};

export default useSearch;
