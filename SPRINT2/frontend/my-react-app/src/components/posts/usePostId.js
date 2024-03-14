import { useState } from 'react';

const usePostId = () => {
  const [postId, setPostId] = useState(null);
  // Other logic related to postId

  return { postId, setPostId };
};

export default usePostId;