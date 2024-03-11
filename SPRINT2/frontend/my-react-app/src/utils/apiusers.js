const apiUrl = "http://localhost:5000";

export const getAllUsers = async () => {
  try {
    const response = await api.get('/api/users');
    return response.data.users;
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

export const searchUsers = async (username) => {
  try {
    const response = await api.get(`/api/search?username=${username}`);
    return response.data.users;
  } catch (error) {
    throw new Error(`Error searching users: ${error.message}`);
  }
};

export const getUser = async (userId) => {
  try {
    console.log('Fetching user data for userId:', userId);
    const response = await api.get(`/api/user/${userId}`);
    console.log('Response from server:', response);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await api.patch('/api/user', userData);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

export const followUser = async (userId) => {
  try {
    const response = await api.patch(`/api/user/${userId}/follow`);
    return response.data;
  } catch (error) {
    throw new Error(`Error following user: ${error.message}`);
  }
};

export const unfollowUser = async (userId) => {
  try {
    const response = await api.patch(`/api/user/${userId}/unfollow`);
    return response.data;
  } catch (error) {
    throw new Error(`Error unfollowing user: ${error.message}`);
  }
};

const usersApi = { getAllUsers, searchUsers, getUser, updateUser, followUser, unfollowUser };

export default usersApi;

