import { useEffect } from "react";
import sanitizeImageUrl from "../utils/sanitizeImageUrl";

const usePostFetch = (apiUrl, setFeedItems, accessToken) => {
  // Fetch Posts
  useEffect(() => {
    const fetchPosts = async () => {
      console.log("Access Token in usePostFetch:", accessToken); // Debug log for token

      if (!accessToken) {
        console.warn("Access token is missing or invalid in usePostFetch.");
        setFeedItems([]); // Clear posts to avoid errors
        return;
      }

      try {
        console.log(`Fetching posts from the server: ${apiUrl}`);
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          console.error(
            `Failed to fetch posts: ${response.status} ${response.statusText}`
          );
          setFeedItems([]); // Clear posts to handle the error gracefully
          return;
        }

        const data = await response.json();
        console.log("Fetched posts data:", data); // Log API response

        // Map data to sanitize image URLs and include likeCount and isLiked
        const mappedData = data.map((post) => ({
          _id: post._id,
          content: post.content || "No content available",
          image: sanitizeImageUrl(post.image, apiUrl), // Ensure sanitized image URLs
          likeCount: post.likeCount || 0, // Include like count
          isLiked: post.isLiked || false, // Include like status
        }));
        console.log("Mapped posts data:", mappedData); // Log mapped data

        setFeedItems(mappedData); // Update feed items
      } catch (error) {
        console.error("Error fetching posts:", error.message);
        setFeedItems([]); // Handle errors gracefully
      }
    };

    fetchPosts();
  }, [apiUrl, accessToken, setFeedItems]);
};

export default usePostFetch;