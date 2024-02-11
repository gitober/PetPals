// postController manages post-related functionalities in a social media application. It facilitates the creation,
// retrieval, update, and deletion of posts. The controller supports features such as liking and saving posts,
// fetching posts from a user's following list, accessing saved posts, and getting details of a single post.
// Additionally, it handles operations related to user-specific posts and ensures secure interactions with posts,
// considering user authentication and proper handling of associated comments.

const Posts = require("../models/postModel");
const Users = require("../models/userModel");
const Comments = require("../models/commentModel");

const postController = {
  // Create a new post
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body;

      // Check if images are provided
      if (images.length === 0)
        return res.status(400).json({ message: "Add a picture" });

      // Create a new post
      const newPost = new Posts({ content, images, user: req.user._id });
      await newPost.save();

      // Return success response
      return res.status(200).json({
        message: "Post saved",
        newPost: { ...newPost._doc, user: req.user },
      });
    } catch (err) {
      // Handle errors
      return res.status(500).json({ message: err.message });
    }
  },

  // Get posts based on user's following list
  getPost: async (req, res) => {
    try {
      // Find posts from user's following list
      const posts = await Posts.find({
        user: [...req.user.following, req.user._id],
      })
        .sort("-createdAt")
        .populate("user likes", "username avatar fullname friends")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      // Return found posts
      return res.status(200).json({
        message: "Posts found",
        result: posts.length,
        posts,
      });
    } catch (err) {
      // Handle errors
      return res.status(500).json({ message: err.message });
    }
  },

  // Update a post
  updatePost: async (req, res) => {
    try {
      const { content, images } = req.body;

      // Find and update the post
      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        { content, images },
        { new: true }
      ).populate("user likes", "username avatar fullname");

      // Return updated post
      return res.status(200).json({
        message: "Post updated",
        newPost: {
          ...post._doc,
          content,
          images,
        },
      });
    } catch (err) {
      // Handle errors
      return res.status(500).json({ message: err.message });
    }
  },

  // Like a post
  likePost: async (req, res) => {
    try {
      // Check if the user has already liked the post
      const post = await Posts.find({
        _id: req.params.id,
        likes: req.user._id,
      });

      if (post.length > 0)
        return res
          .status(400)
          .json({ message: "You have already liked this post" });

      // Add user's like to the post
      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { likes: req.user._id } },
        { new: true }
      );

      if (!like) return res.status(400).json({ message: "Post not found" });

      // Return success response
      return res.json({ message: "Post liked!" });
    } catch (err) {
      // Handle errors
      return res.status(500).json({ message: err.message });
    }
  },

  // Save a post to user's saved list
  savePost: async (req, res) => {
    try {
      // Check if the user has already saved the post
      const user = await Users.find({
        _id: req.user._id,
        saved: req.params.id,
      });

      if (user.length > 0)
        return res
          .status(400)
          .json({ message: "You have already saved this post" });

      // Add the post to the user's saved list
      await Users.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { saved: req.params.id } },
        { new: true }
      );

      // Return success response
      return res.json({ message: "Post Saved" });
    } catch (err) {
      // Handle errors
      return res.status(500).json({ message: err.message });
    }
  },

  // Unsave a post from user's saved list
  unsavePost: async (req, res) => {
    try {
      // Remove the post from user's saved list
      await Users.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { saved: req.params.id } },
        { new: true }
      );

      // Return success response
      return res.json({ message: "Post unsaved" });
    } catch (err) {
      // Handle errors
      return res.status(500).json({ message: err.message });
    }
  },

  // Unlike a post
  unlikePost: async (req, res) => {
    try {
      // Remove user's like from the post
      const unlike = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { likes: req.user._id } },
        { new: true }
      );

      if (!unlike) return res.status(400).json({ message: "Post not found" });

      // Return success response
      return res.json({ message: "Unliked post" });
    } catch (err) {
      // Handle errors
      return res.status(500).json({ message: err.message });
    }
  },

  // Get posts saved by the user
  getsavedPost: async (req, res) => {
    try {
      // Find posts saved by the user
      const savedposts = await Posts.find({ _id: { $in: req.user.saved } })
        .sort("-createdAt")
        .populate("user likes", "username avatar fullname");

      // Return saved posts
      return res.json({ message: "Saved posts found", savedposts });
    } catch (err) {
      // Handle errors
      return res.status(500).json({ message: "Error fetching saved posts" });
    }
  },

  // Get posts by a specific user
  getUserPosts: async (req, res) => {
    try {
      // Find posts by the specified user
      const posts = await Posts.find({ user: req.params.id })
        .sort("-createdAt")
        .populate("user likes", "username avatar fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      // Return found posts
      return res.status(200).json({
        message: "Posts found",
        result: posts.length,
        posts,
      });
    } catch (err) {
      // Handle errors
      return res.status(500).json({ message: err.message });
    }
  },

  // Get details of a single post
  getSinglePost: async (req, res) => {
    try {
      // Find details of the specified post
      const post = await Posts.findById(req.params.id)
        .populate("user likes", "username avatar fullname friends")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      // Return details of the post
      return res.status(200).json({ post });
    } catch (err) {
      // Handle errors
      return res.status(500).json({ message: err.message });
    }
  },

  // Delete a post
  deletePost: async (req, res) => {
    try {
      // Find and delete the post
      const post = await Posts.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      // Delete comments associated with the post
      await Comments.deleteMany({ _id: { $in: post.comments } });

      // Return success response
      return res.json({
        message: "Post deleted",
        newPost: { ...post._doc, user: req.user },
      });
    } catch (err) {
      // Handle errors
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = postController;
