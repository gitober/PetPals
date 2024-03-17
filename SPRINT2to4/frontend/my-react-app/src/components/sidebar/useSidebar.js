import { useState, useEffect } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const useSidebar = () => {
  // Import the simulateTestMode function from useTestModeInstance hook
  const { simulateTestMode } = useTestModeInstance();

  // State for managing the visibility of the post popup
  const [popupPostVisible, setPopupPostVisible] = useState(false);

  // Function to open the post popup
  const openPopupPost = () => {
    console.log('Opening post popup from sidebar');
    setPopupPostVisible(true);
  };

  // If in test mode, simulate additional logic
  useEffect(() => {
    if (simulateTestMode) {
      simulateTestMode('Opening post popup from sidebar');
      // Additional logic specific to test mode...
    }
  }, [simulateTestMode]);

  // Return the state and functions needed by the Sidebar component
  return { popupPostVisible, openPopupPost, setPopupPostVisible };
};

export default useSidebar;