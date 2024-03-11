// src\hooks\homepagehooks\useTestMode.js
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Ensure the correct path

// Custom hook for managing test mode
export function useTestMode() {
  const [isTestMode, setIsTestMode] = useState(true); // true for testing purposes - false for production
  const { isTestMode: authTestMode } = useAuth(); 

  const toggleTestMode = () => {
    setIsTestMode((prevIsTestMode) => !prevIsTestMode);
  };

  const simulateTestMode = (message, additionalData) => {
    if (isTestMode || authTestMode) {
      console.log(`Test mode: ${message}`);
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
