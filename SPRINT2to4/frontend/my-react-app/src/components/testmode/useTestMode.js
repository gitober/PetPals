import { useState } from 'react';

// Custom hook for managing test mode
export function useTestMode() {
  const [isTestMode, setIsTestMode] = useState(true); // true for testing purposes - false for production

  const toggleTestMode = () => {
    setIsTestMode((prevIsTestMode) => !prevIsTestMode);
  };

  const simulateTestMode = (message, additionalData) => {
    if (isTestMode) {
      if (additionalData) {
        console.log("Additional Data:", additionalData);
      }
    }
  };

  // You can add more functions or state variables if needed

  return { isTestMode, toggleTestMode, simulateTestMode };
}

// Exporting the simulateTestMode function separately
export const useTestModeInstance = useTestMode;