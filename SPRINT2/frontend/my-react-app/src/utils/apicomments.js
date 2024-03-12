const apiUrl = 'http://localhost:5000';

export const createComment = async (commentData) => {
  try {
    const response = await fetch(`${apiUrl}/api/comment/${commentData.postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
      body: JSON.stringify(commentData),
    });

    if (response.ok) {
      const data = await response.json();
      return data.newComment;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error(`Error creating comment: ${error.message}`);
  }
};

export const updateComment = async (commentId, newContent) => {
  try {
    const response = await fetch(`${apiUrl}/api/comment/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
      body: JSON.stringify({ content: newContent }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error(`Error updating comment: ${error.message}`);
  }
};

export const likeComment = async (commentId) => {
  try {
    const response = await fetch(`${apiUrl}/api/comment/${commentId}/like`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error(`Error liking comment: ${error.message}`);
  }
};

export const unlikeComment = async (commentId) => {
  try {
    const response = await fetch(`${apiUrl}/api/comment/${commentId}/unlike`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error(`Error unliking comment: ${error.message}`);
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await fetch(`${apiUrl}/api/comment/${commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error) {
    throw new Error(`Error deleting comment: ${error.message}`);
  }
};

const commentApi = {
  createComment,
  updateComment,
  likeComment,
  unlikeComment,
  deleteComment,
};

export default commentApi;
