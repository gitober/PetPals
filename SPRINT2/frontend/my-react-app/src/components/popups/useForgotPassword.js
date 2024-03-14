import { useState } from 'react';
import { useTestModeInstance } from '../../component/testmode/useTestMode'; // Import the test mode hook

const useForgotPassword = (closeForgotPasswordPopup, isTestModeForgotPassword) => {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState();

  // Include the useTestModeInstance hook
  const { simulateTestMode } = useTestModeInstance();

  const handleForgotPasswordSubmit = (event) => {
    event.preventDefault();

    try {
      console.log("Forgot password for email:", forgotPasswordEmail);

      // Simulate test mode if enabled
      simulateTestMode("Simulating forgot password submission");

      if (isTestModeForgotPassword) {
        // Simulate a successful response in test mode
        console.log("Test mode: Simulating successful forgot password");

        // Additional actions for test mode if needed

        // Reset the email field
        setForgotPasswordEmail("");
      } else {
        // Make an actual API call for forgot password
        // ...

        // Close the forgot password popup
        closeForgotPasswordPopup();
      }
    } catch (error) {
      console.error("Error during forgot password:", error);
    }
  };

  return {
    forgotPasswordEmail,
    setForgotPasswordEmail,
    handleForgotPasswordSubmit,
  };
};

export default useForgotPassword;