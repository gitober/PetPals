const apiUrl = "http://localhost:5000";

export const login = async (username, password) => {
  try {
    const response = await fetch(`${apiUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    console.log("Response from apiLogin:", response);

    if (response.ok) {
      const data = await response.json();
      console.log("Data received from server:", data);

      // Check if accessToken is present in data
      if (data.access_token) {
        // Update the following line to correctly access the access_token field
        return { accessToken: data.access_token, refreshToken: data.refreshToken, user: data.user };
      } else {
        console.error("Login failed. Server did not provide an access token.");
        throw new Error("Login failed. Server did not provide an access token.");
      }
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error(`Error during login: ${error.message}`);
  }
};


export const register = async (username, email, password) => {
  try {
    const response = await fetch(`${apiUrl}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error(`Error during registration: ${error.message}`);
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // Clear localStorage on successful logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
      const data = await response.json();
      return data;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error(`Error during logout: ${error.message}`);
  }
};

export const fetchAccessToken = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/refresh_token', {
      method: 'POST',
      credentials: 'include', // Include credentials (cookies) in the request
    });

    if (!response.ok) {
      throw new Error(`Error refreshing access token. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Refreshed access token:', data.access_token);
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error.message);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/refresh_token', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error refreshing access token. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Refreshed access token:', data.access_token);
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error.message);
    throw error;
  }
};

const authApi = { login, register, logout, refreshToken };

export default authApi;
