import { useState } from 'react';
import { useTestModeInstance } from '../testmode/useTestMode';

const useSignup = (apiUrl, isTestModeSignup) => {
  const [signupFormData, setSignupFormData] = useState({
    username: '',
    email: '',
    password: '',
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
      console.log('Handling signup submission');

      simulateTestMode('Simulating signup submission'); // Simulate test mode

      if (isTestModeSignup) {
        // Simulate a successful response in test mode
        console.log('Test mode: Simulating successful signup');

        // Perform actions as needed for testing

        // Reset the signup form
        setSignupFormData({
          username: '',
          email: '',
          password: '',
        });

        // Close the signup popup
        setSignupPopupVisible(false);
      } else {
        // Use fetch for the actual signup logic
        const { username, email, password } = signupFormData;

        try {
          // Make an actual API call for signup
          const response = await fetch(`${apiUrl}/api/users/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
          });

          const responseData = await response.json();

          // Log the entire response for debugging
          console.log('Response:', responseData);

          if (response.ok) {
            // Check if signup was successful
            if (responseData.accessToken) {
              // Successful signup
              console.log('Signup successful');
              // Perform additional actions or redirect the user

              // Reset the signup form
              setSignupFormData({
                username: '',
                email: '',
                password: '',
              });

              // Close the signup popup
              setSignupPopupVisible(false);
            } else {
              // Signup failed
              console.error('Signup failed. Server responded with:', responseData.error);
              // Handle the error, show a message, etc.
            }
          } else {
            // Signup failed due to server error
            console.error('Signup failed. Server responded with:', response.statusText);
            // Handle the error, show a message, etc.
          }
        } catch (error) {
          console.error('Error during API call for signup:', error);
          // Handle the error, show a message, etc.
        }
      }
    } catch (error) {
      console.error('Error during signup:', error);
      // Handle the error, show a message, etc.
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
