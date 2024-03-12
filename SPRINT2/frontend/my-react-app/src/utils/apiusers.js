const apiUrl = 'http://localhost:5000';

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/user`);
    const data = await response.json();
    return data.users;
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

export const searchUsers = async (username) => {
  try {
    const response = await fetch(`${apiUrl}/api/search?username=${username}`);
    const data = await response.json();
    return data.users;
  } catch (error) {
    throw new Error(`Error searching users: ${error.message}`);
  }
};

export const getUser = async (userId) => {
  try {
    console.log('Fetching user data for userId:', userId);
    const response = await fetch(`${apiUrl}/api/user/${userId}`);
    console.log('Response from server:', response);
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await fetch(`${apiUrl}/api/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

export const followUser = async (userId) => {
  try {
    const response = await fetch(`${apiUrl}/api/user/${userId}/follow`, {
      method: 'PATCH',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error following user: ${error.message}`);
  }
};

export const unfollowUser = async (userId) => {
  try {
    const response = await fetch(`${apiUrl}/api/user/${userId}/unfollow`, {
      method: 'PATCH',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error unfollowing user: ${error.message}`);
  }
};

const usersApi = {
  getAllUsers,
  searchUsers,
  getUser,
  updateUser,
  followUser,
  unfollowUser,
};

export default usersApi;
