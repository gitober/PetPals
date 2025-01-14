const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000, // Optional: Limit content length
    },
    image: {
      type: String,
      required: [true, "Image is required"],
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/|^\/uploads\//.test(v); // URL or local path
        },
        message: "Invalid image URL or file path. It must be a valid URL or start with '/uploads/'.",
      },
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId], // Array of user IDs
      ref: "User", // Reference to the User model
      default: [], // Default is an empty array
      validate: {
        validator: function (value) {
          // Ensure the array contains only unique ObjectIds
          return Array.isArray(value) && new Set(value.map(String)).size === value.length;
        },
        message: "Likes array must contain unique user IDs.",
      },
    },
      
    commentsCount: {
      type: Number,
      default: 0,
      min: [0, "Comments count cannot be negative"],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.every((tag) => tag.length <= 20) && v.length <= 10;
        },
        message:
          "Each tag must be at most 20 characters long, and there can be a maximum of 10 tags.",
      },
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Middleware to validate and clean image paths before saving
postSchema.pre("save", function (next) {
  if (this.isModified("image")) {
    // Ensure the image path starts with "/uploads/" if it's not a full URL
    if (!/^(http|https):\/\//.test(this.image) && !this.image.startsWith("/uploads/")) {
      this.image = `/uploads/${this.image}`;
    }

    // Normalize the path by replacing backslashes with forward slashes
    this.image = this.image.replace(/\\/g, "/");
  }
  next();
});

// Middleware to validate and clean image paths during updates
postSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.image) {
    // Ensure the image path starts with "/uploads/" if it's not a full URL
    if (!/^(http|https):\/\//.test(update.image) && !update.image.startsWith("/uploads/")) {
      update.image = `/uploads/${update.image}`;
    }

    // Normalize the path by replacing backslashes with forward slashes
    update.image = update.image.replace(/\\/g, "/");
  }

  next();
});

// Add index to speed up queries filtering by user_id
postSchema.index({ user_id: 1 });

module.exports = mongoose.model("Post", postSchema);
