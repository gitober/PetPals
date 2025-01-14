const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer configuration for file uploads

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Create 'uploads' directory if it doesn't exist
    }
    console.log("Uploading to path:", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Replace hyphens with underscores in the original file name
    const sanitizedOriginalName = file.originalname.replace(/-/g, "_");
    const uniqueName = `${Date.now()}-${sanitizedOriginalName}`;
    console.log("Generated filename:", uniqueName);
    cb(null, uniqueName); // Use sanitized filename
  },
  
});

// File filter configuration
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/; // Allowed extensions
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  console.log("File extension valid:", extName);
  console.log("File mimetype valid:", mimeType);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, and .png files are allowed!"));
  }
};

module.exports = multer({ storage, fileFilter });
