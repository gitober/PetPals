/**
 * Sanitizes image URLs to ensure consistent formatting.
 *
 * @param {string|null} url - The image URL to sanitize.
 * @param {string} apiUrl - The base API URL for relative paths.
 * @returns {string|null} - The sanitized URL or null.
 */
const sanitizeImageUrl = (url, apiUrl) => {
  if (!url) return null;

  if (url.startsWith("http")) {
    return url;
  }

  return `${apiUrl.replace(/\/+$/, "")}/${url.replace(/^\/+/, "").replace(/\\/g, "/")}`;
};

export default sanitizeImageUrl;