import { useState } from "react";

const useSidebar = () => {
  // State for managing the visibility of the post popup
  const [popupPostVisible, setPopupPostVisible] = useState(false);

  // Function to open the post popup
  const openPopupPost = () => {
    console.log("Opening post popup from sidebar");
    setPopupPostVisible(true);
  };

  // Return the state and functions needed by the Sidebar component
  return { popupPostVisible, openPopupPost, setPopupPostVisible };
};

export default useSidebar;