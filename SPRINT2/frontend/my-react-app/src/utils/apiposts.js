const apiUrl = "http://localhost:5000";

export const createPost = async (formData, auth_token) => {
  console.log('Sending data to server:', formData);
  console.log('API URL:', `${apiUrl}/api/posts`);
  console.log('Headers:', {
    Authorization: `Bearer ${auth_token}`,
    'Content-Type': 'multipart/form-data',
  });

  try {
    const response = await fetch(`${apiUrl}/api/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
      body: formData,
    });

    console.log('Server response:', response);

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    const data = await response.json();
    console.log('Data from server:', data);
    return data;
  } catch (error) {
    console.error('Error creating post:', error.message);
    throw error;
  }
};



export const getPosts = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/posts`);
    return await response.json();
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error.message;
  }
};

export const getSinglePost = async (postId) => {
  try {
    const response = await fetch(`${apiUrl}/api/posts/${postId}`);
    return await response.json();
  } catch (error) {
    console.error('Error getting single post:', error);
    throw error.message;
  }
};

export const updatePost = async (postId, postData, token) => {
  try {
    const response = await fetch(`${apiUrl}/api/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating post:', error);
    throw error.message;
  }
};

export const likePost = async (postId, token) => {
  try {
    const response = await fetch(`${apiUrl}/api/posts/${postId}/like`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error liking post:', error);
    throw error.message;
  }
};

export const unlikePost = async (postId, token) => {
  try {
    const response = await fetch(`${apiUrl}/api/posts/${postId}/unlike`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error.message;
  }
};

export const savePost = async (postId, token) => {
  try {
    const response = await fetch(`${apiUrl}/api/posts/${postId}/save`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving post:', error);
    throw error.message;
  }
};

export const unsavePost = async (postId, token) => {
  try {
    const response = await fetch(`${apiUrl}/api/posts/${postId}/unsave`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error unsaving post:', error);
    throw error.message;
  }
};

export const getSavedPosts = async (token) => {
  try {
    const response = await fetch(`${apiUrl}/api/posts/saved`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error getting saved posts:', error);
    throw error.message;
  }
};

export const getUserPosts = async (userId, token) => {
  try {
    const response = await fetch(`${apiUrl}/api/user_posts/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error getting user posts:', error);
    throw error.message;
  }
};

const postsApi = { createPost, getPosts, getSinglePost, updatePost, likePost, unlikePost, savePost, unsavePost, getSavedPosts, getUserPosts };

export default postsApi;
