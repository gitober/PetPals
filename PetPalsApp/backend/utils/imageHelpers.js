// Utility to format image URLs for frontend use
const formatImageUrl = (req, imagePath, placeholder = null) => {
  if (!imagePath) {
    return placeholder ? `${req.protocol}://${req.get("host")}/${placeholder}` : null;
  }
  return imagePath.startsWith("http")
    ? imagePath
    : `${req.protocol}://${req.get("host")}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
};

// Utility to format profile picture URLs
const formatProfilePicture = (req, profilePicture) => {
  return profilePicture
    ? `${req.protocol}://${req.get("host")}/${profilePicture}`
    : `${req.protocol}://${req.get("host")}/placeholder-image.png`;
};

module.exports = {
  formatImageUrl,
  formatProfilePicture,
};
