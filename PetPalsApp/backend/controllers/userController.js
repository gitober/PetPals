const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { formatProfilePicture } = require("../utils/imageHelpers");
const { createToken, createRefreshToken, refreshAccessToken } = require("../utils/authHelpers");


// Signup a user
const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate input fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        error: "Password must include at least 8 characters, an uppercase letter, a number, and a special character",
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        error: "Username can only contain letters, numbers, and underscores",
      });
    }

    // Check if email already exists (case-insensitive)
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Check if username already exists (case-insensitive)
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    // Respond with success
    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ error: "An error occurred. Please try again later." });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username: { $regex: `^${username}$`, $options: "i" } }).select("+password");
    console.log("Queried User:", user);

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password Valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const accessToken = createToken(user._id); // Short-lived token
    const refreshToken = createRefreshToken(user._id); // Long-lived token

    console.log("Generated Access Token:", accessToken);
    console.log("Generated Refresh Token:", refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: formatProfilePicture(req, user.profilePicture),
      createdAt: user.createdAt,
      accessToken,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "An error occurred during login" });
  }
};

// Validate fields (username or email)
const validateField = async (req, res) => {
  const { username, email } = req.body;

  try {
    if (username) {
      const existingUsername = await User.findOne({ username: username.toLowerCase() });
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    if (email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    return res.status(200).json({ message: "Field is valid" });
  } catch (error) {
    console.error("Error validating field:", error.message);
    res.status(500).json({ message: "An error occurred. Please try again later." });
  }
};

// Get all users with optional search functionality
const getAllUsers = async (req, res) => {
  const { search } = req.query;

  try {
    if (search && typeof search !== "string") {
      return res.status(400).json({ error: "Invalid search parameter" });
    }

    const query = search
      ? { username: { $regex: search, $options: "i" } }
      : {};

    const limit = parseInt(req.query.limit, 10) || 10; // Default limit to 10
    const skip = parseInt(req.query.skip, 10) || 0;   // Default no skipping

    const users = await User.find(query)
      .select("username profilePicture")
      .limit(limit)
      .skip(skip);

    const formattedUsers = users.map((user) => ({
      ...user.toObject(),
      profilePicture: formatProfilePicture(req, user.profilePicture),
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get a user by username
const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username })
      .populate("followers", "_id username profilePicture") 
      .populate("following", "_id username profilePicture")
      .select("_id username email profilePicture bioText followers following");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const loggedInUserId = req.user?._id;
    const isFollowing = user.followers.some(
      (follower) => follower._id.toString() === loggedInUserId?.toString()
    );

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      bioText: user.bioText,
      profilePicture: formatProfilePicture(req, user.profilePicture),
      followers: user.followers,
      following: user.following,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      isFollowing,
    });
  } catch (error) {
    console.error("Error fetching user by username:", error.message);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};


// Update a user by username
const updateUserByUsername = async (req, res) => {
  const { username } = req.params;
  const { newUsername, email, password, bioText } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update username if provided and not already taken
    if (newUsername && newUsername !== username) {
      const usernameExists = await User.findOne({ username: newUsername });
      if (usernameExists) {
        return res.status(400).json({ error: "Username already taken" });
      }
      user.username = newUsername;
    }

    // Validate and update email
    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      user.email = email;
    }

    // Update password if provided and hash it
    if (password) {
      if (password.trim().length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Update bioText if provided
    if (bioText) {
      user.bioText = bioText.trim();
    }

    await user.save();

    // Return updated user data
    res.status(200).json({
      username: user.username,
      email: user.email,
      bioText: user.bioText,
      profilePicture: formatProfilePicture(req, user.profilePicture),
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Update password by username
const updatePasswordByUsername = async (req, res) => {
  const { username } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Both current and new passwords are required" });
  }

  try {
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword.trim(), user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(newPassword.trim())) {
      return res.status(400).json({
        error: "New password must be at least 6 characters long, include at least one letter, one number, and one special character",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword.trim(), user.password);
    if (isSamePassword) {
      return res.status(400).json({ error: "New password cannot be the same as the current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error.message);
    return res.status(500).json({ error: "Failed to update password" });
  }
};

// Update Profile Picture
const updateProfilePicture = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.file) {
      user.profilePicture = `uploads/${req.file.filename}`;
      await user.save();

      res.status(200).json({
        ...user.toObject(),
        profilePicture: formatProfilePicture(req, user.profilePicture),
      });
    } else {
      res.status(400).json({ error: "No file uploaded" });
    }
  } catch (error) {
    console.error("Error updating profile picture:", error.message);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};

// Follow a user
const followUser = async (req, res) => {
  const { username } = req.params;
  const { _id } = req.user;

  try {
    const userToFollow = await User.findOne({ username });
    if (!userToFollow) {
      return res.status(404).json({ error: `User with username ${username} not found` });
    }

    if (userToFollow.followers.includes(_id)) {
      console.log("Already following:", userToFollow.followers);
      return res.status(200).json({ message: "Already following this user" });
    }

    // Log before update
    console.log("Before follow - followers:", userToFollow.followers);

    userToFollow.followers.push(_id);
    await userToFollow.save();

    const currentUser = await User.findById(_id);
    currentUser.following.push(userToFollow._id);
    await currentUser.save();

    // Log after update
    console.log("After follow - followers:", userToFollow.followers);
    console.log("After follow - current user's following:", currentUser.following);

    res.status(200).json({
      message: `You are now following ${username}`,
      followers: userToFollow.followers.length,
      followingCount: currentUser.following.length,
      isFollowing: true,
    });
  } catch (error) {
    console.error("Error following user:", error.message);
    res.status(500).json({ error: "Failed to follow user" });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  const { username } = req.params;
  const { _id } = req.user; // The logged-in user's ID

  try {
    console.log("req.user:", req.user);

    const userToUnfollow = await User.findOne({ username });
    if (!userToUnfollow) {
      return res.status(404).json({ error: `User with username ${username} not found` });
    }

    if (!userToUnfollow.followers.includes(_id)) {
      return res.status(400).json({ error: "You are not following this user" });
    }

    // Remove user from followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (followerId) => followerId.toString() !== _id.toString()
    );
    await userToUnfollow.save();

    // Remove target user from current user's following list
    const currentUser = await User.findById(_id);
    currentUser.following = currentUser.following.filter(
      (followingId) => followingId.toString() !== userToUnfollow._id.toString()
    );
    await currentUser.save();

    res.status(200).json({
      message: `You have unfollowed ${username}`,
      followers: userToUnfollow.followers.length,
      followingCount: currentUser.following.length,
      isFollowing: false,
    });
  } catch (error) {
    console.error("Error unfollowing user:", error.message);
    res.status(500).json({ error: "Failed to unfollow user" });
  }
};

// Logout a user by clearing the refresh token cookie
const logoutUser = async (req, res) => {
  try {
      // Clear the refresh token cookie
      res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
      });

      res.status(200).json({ message: "Logout successful" });
  } catch (error) {
      console.error("Error during logout:", error.message);
      res.status(500).json({ error: "Failed to logout" });
  }
};

// Forgot password with email
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "No user found with this email" });
    }

    // Generate a temporary password
    const tempPassword = crypto.randomBytes(6).toString("hex"); // 12-character temporary password
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    // Update user with temporary password
    user.password = hashedTempPassword;
    user.passwordTemporary = true; // Custom flag to indicate temp password
    await user.save();

    // Send email with the temporary password
    await nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    }).sendMail({
      to: user.email,
      subject: "Temporary Password for Your Account",
      html: `
        <p>We have reset your password as per your request.</p>
        <p>Your temporary password is: <strong>${tempPassword}</strong></p>
        <p>Please log in with this temporary password and change it in your account settings.</p>
      `,
    });

    res.status(200).json({ message: "Temporary password has been sent to your email." });
  } catch (error) {
    console.error("Error during forgot password:", error.message);
    res.status(500).json({ error: "Failed to process request" });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error during password reset:", error.message);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

// Validate Current Password
const validatePassword = async (req, res) => {
  const { password } = req.body; // Password provided by the user
  const userId = req.user?._id; // Assuming the user is authenticated and user ID is in req.user

  // Check if the password is provided
  if (!password) {
    return res.status(400).json({ error: "Old password is required." });
  }

  try {
    // Fetch user with the hashed password
    const user = await User.findById(userId).select("+password");

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Old password doesn't match." });
    }

    // If valid, return success
    res.status(200).json({ message: "Old password is correct." });
  } catch (error) {
    console.error("Error validating password:", error.message);
    res.status(500).json({ error: "An error occurred. Please try again later." });
  }
};

module.exports = {
  refreshAccessToken,
  signupUser,
  loginUser,
  validateField,
  getAllUsers,
  getUserByUsername,
  updateUserByUsername,
  updatePasswordByUsername,
  updateProfilePicture,
  followUser,
  unfollowUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  validatePassword,
};
