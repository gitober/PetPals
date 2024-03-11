import { useState } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';
import authApi from '../../utils/apiauth'; 

const useSignup = (apiUrl, isTestModeSignup) => {
  const [signupFormData, setSignupFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [signupPopupVisible, setSignupPopupVisible] = useState(false);

  // Include the useTestModeInstance hook
  const { simulateTestMode } = useTestModeInstance();

  const handleSignupInputChange = (e) => {
    setSignupFormData({
      ...signupFormData,
      [e.target.name]: e.target.value,
    });
  };

  const openSignupPopup = () => {
    setSignupPopupVisible(true);
  };

  const closeSignupPopup = () => {
    setSignupPopupVisible(false);
  };

 const handleSignupSubmit = async (event) => {
  event.preventDefault();

  try {
    console.log("Handling signup submission");

    simulateTestMode("Simulating signup submission"); // Simulate test mode

    if (isTestModeSignup) {
      // Simulate a successful response in test mode
      console.log("Test mode: Simulating successful signup");

      // Perform actions as needed for testing

      // Reset the signup form
      setSignupFormData({
        username: "",
        email: "",
        password: "",
      });

      // Close the signup popup
      setSignupPopupVisible(false);
    } else {
      // Use authApi.register for the actual signup logic
      const { username, email, password } = signupFormData;
      const response = await authApi.register(username, email, password);

      // Log the entire response for debugging
      console.log('Response:', response);

      if (response.message === 'Registration Successful!') {
        // Successful signup
        console.log("Signup successful");
        // Perform additional actions or redirect the user

        // Reset the signup form
        setSignupFormData({
          username: "",
          email: "",
          password: "",
        });

        // Close the signup popup
        setSignupPopupVisible(false);
      } else {
        // Signup failed
        console.error("Signup failed. Server responded with:", response.message);
        // Handle the error, show a message, etc.
      }
    }
  } catch (error) {
    console.error("Error during signup:", error);
  }
};

  return {
    signupFormData,
    signupPopupVisible,
    handleSignupInputChange,
    openSignupPopup,
    closeSignupPopup,
    handleSignupSubmit,
  };
};

export default useSignup;
