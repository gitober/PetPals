import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestModeInstance } from '../../components/testmode/useTestMode';
import { UserContext } from '../../context/UserContext';

const useLogin = (apiUrl, isTestModeLogin) => {
  const navigate = useNavigate();
  const { setUsername: setContextUsername } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordPopupVisible, setForgotPasswordPopupVisible] = useState(false);
  const [signupPopupVisible, setSignupPopupVisible] = useState(false);
  const [loginDisabled, setLoginDisabled] = useState(true);
  const { isTestMode } = useTestModeInstance();

  const openForgotPasswordPopup = () => {
    setForgotPasswordPopupVisible(true);
  };

  const openSignupPopup = () => {
    setSignupPopupVisible(true);
  };

  const closeForgotPasswordPopup = () => {
    setForgotPasswordPopupVisible(false);
  };

  const closeSignupPopup = () => {
    setSignupPopupVisible(false);
  };

  useEffect(() => {
    setLoginDisabled(!(username && password));
  }, [username, password]);

  const handleLoginSubmit = async (event) => {
  event.preventDefault();

  try {
    if (isTestMode && !isTestModeLogin) {
      console.log('Test mode: Simulating successful login');
      navigate('/home');
      return;
    }

    const loginData = {
      username: username,
      password: password
    };

    const loginResponse = await fetch(`${apiUrl}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    const responseData = await loginResponse.json();
    console.log('Login response data:', responseData); // Log the response data

    if (loginResponse.ok) {
      const accessToken = responseData && responseData.token; // Check if token exists
      if (accessToken) {
        console.log('Login successful. Access Token:', accessToken);

        localStorage.setItem('accessToken', accessToken); // Store access token in localStorage
        localStorage.setItem('username', username);

        setContextUsername(username);

        console.log('localStorage accessToken (after setting):', localStorage.getItem('accessToken'));
        console.log('localStorage username (after setting):', localStorage.getItem('username'));

        navigate('/home');

        // Fetch user data
        const userResponse = await fetch(`${apiUrl}/api/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log('User data:', userData);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } else {
        throw new Error('Access token not found in response data');
      }
    } else {
      throw new Error(`Login failed. Server responded with: ${loginResponse.status}`);
    }
  } catch (error) {
    console.error('Error during login:', error.message);
  }
};

  return {
    username,
    setUsername,
    password,
    setPassword,
    loginDisabled,
    handleLoginSubmit,
    forgotPasswordPopupVisible,
    openForgotPasswordPopup,
    closeForgotPasswordPopup,
    signupPopupVisible,
    openSignupPopup,
    closeSignupPopup,
  };
};

export default useLogin;