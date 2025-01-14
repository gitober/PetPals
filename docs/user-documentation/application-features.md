# Application Walkthrough

The application offers various features that allow users to navigate, interact, and manage their profiles, posts, and connections. Below is a detailed walkthrough of its key functionalities.

*Note: Images used for application testing were sourced from [Pixabay](https://pixabay.com/), a platform for free, high-quality stock images.*


## Contents
- [Login, Forgot Password, and Registration](#login-forgot-password-and-registration)
- [Navigation and Search](#navigation-and-search)
- [Home Feed](#home-feed)
- [Profile Page](#profile-page)
- [User Profile Page](#user-profile-page)
- [Post Creation and Management](#post-creation-and-management)
- [Follow Modal](#follow-modal)
- [Settings](#settings)

---

### Login, Forgot Password, and Registration
- **Login:** Users log in with their credentials to access the dashboard.
  
  ![Login Page](../../images/pages/1.login-page.png "login")

- **Register:** New users can sign up by completing a form and clicking "Sign up."

  ![Sign Up](../../images/features/1.signup.png "signup")

- **Forgot Password:** Clicking "Forgot your password?" sends a temporary password via email, which can be used to log in and update the password in settings.

  ![Forgot Password](../../images/features/2.forgot-password.png "forgot_password")

<p align="right">(<a href="#contents">back to top</a>)</p>

---

### Navigation and Search
- **Search Bar:** Search for other users dynamically with real-time results and error handling for invalid queries.

  ![Searchbar](../../images/features/4.searchbar.png "searchbar")

- **Sidebar:** Access essential features like creating a post, navigating to the home feed, viewing your profile, accessing settings, and logging out.

  ![Sidebar](../../images/features/4.0.sidebar.png "sidebar")

<p align="right">(<a href="#contents">back to top</a>)</p>

---

### Home Feed
- **Feed Display:** Displays posts from all users, including profile pictures, usernames, images, content, and interaction buttons (like and comment). Also features your followings list, allowing you to view the users you are following and navigate directly to their profiles by clicking on their names.

  ![Home Feed](../../images/pages/2.home-page.png "home_feed")

- **Like Functionality:** Like or unlike posts in real-time, with updates to the like count.

- **Comment Popup:** View and submit comments. Post owners can delete comments or posts directly.

  ![Comment Popup](../../images/features/3.comment-popup-homefeed.png "comment_popup_home")

<p align="right">(<a href="#contents">back to top</a>)</p>

---

### Profile Page
- **Profile Overview:** Displays username, profile picture, bio, followers, and following counts. Users can view their posts.

- **Post Management:** Delete your posts or comments on your posts dynamically.

- **Followers and Following Modal:** View and navigate to other user profiles.

  ![Profile Page](../../images/pages/3.profile-page.png "profile_page")

<p align="right">(<a href="#contents">back to top</a>)</p>

---

### Post Creation and Management
- **Post Creation:** Create posts with text and images. Preview images before submission.

  ![Add Post](../../images/features/6.add-post.png "add_post")

- **Post Deletion:** Delete posts dynamically from the feed or profile page.

  ![Delete Post](../../images/features/7.delete-post.png "delete_post")

- **Comment Deletion:** Post owners can delete comments directly from the feed or profile page.

  ![Delete Post](../../images/features/8.delete-comment.png "delete_post")

<p align="right">(<a href="#contents">back to top</a>)</p>

---

### User Profile Page
- **Profile Overview:** View another user’s username, bio, followers, and following counts.

- **Post Interaction:** Like and comment on their posts.

- **Followers and Following Modal:** Displays follower and following lists.

  ![User Profile Page](../../images/pages/4.user-profile-page.png "user_profile_page")

- **Follow/Unfollow:** Follow or unfollow users dynamically.

  ![Follow Button](../../images/features/11.follow-button-user-profile.png "user_profile_page")

<p align="right">(<a href="#contents">back to top</a>)</p>

---

### Follow Modal
- **Follow System:**
  - **Follow Modal:** Displays followers and following lists with profile pictures and usernames.
  - **Dynamic Updates:** Actions update follower and following counts in real-time.

  ![Followers Modal](../../images/features/9.followers-modal.png "followers_modal")

<p align="right">(<a href="#contents">back to top</a>)</p>

---

### Settings
- **Settings Page:** Update your profile picture, username, bio, or password securely. Changes are validated and applied dynamically.

  ![Settings Page](../../images/pages/5.settings-page.png "settings_page")

  ![Change Username](../../images/features/12.settings-change-username.png "change_username")

  ![Edit Bio](../../images/features/13.settings-edit-bio.png "edit_bio")

  ![Change Password](../../images/features/14.settings-change-password.png "change_password")


<p align="right">(<a href="#contents">back to top</a>)</p>

---

## Summary
The application provides a user-friendly interface for managing profiles, posts, and connections. Key features include:
- Secure login, registration, and password recovery, with clear error messages for invalid inputs or failed attempts.
- Intuitive navigation with a sidebar and search functionality, including error feedback for invalid or empty search queries.
- Real-time updates for likes, comments, posts, and follow actions.
- Dynamic and responsive design for seamless use across devices.
- Comprehensive settings to manage profile information and security.

This walkthrough highlights the robust functionality designed to enhance user engagement and satisfaction.

---

[Back to Project Overview](../project-overview.md)