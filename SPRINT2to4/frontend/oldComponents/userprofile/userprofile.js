// import React, { useState } from 'react';

// const UserProfile = () => {
//     const [isFollowing, setIsFollowing] = useState(false);

//     const toggleFollow = () => {
//         setIsFollowing((prevState) => !prevState);
//     };

//     // Simulated data (replace this with actual data from your application)
//     const userPictures = [
//         "/SPRINT2/frontend/img/profiledog.jpg",
//         "/SPRINT2/frontend/img/profiledog.jpg",
//         "/SPRINT2/frontend/img/profiledog.jpg",
//         "/SPRINT2/frontend/img/profiledog.jpg",
//         "/SPRINT2/frontend/img/profiledog.jpg",
//         "/SPRINT2/frontend/img/profiledog.jpg",
//         "/SPRINT2/frontend/img/profiledog.jpg",
//         "/SPRINT2/frontend/img/profiledog.jpg",
//         // Add more picture URLs as needed
//     ];

//     // Function to dynamically populate the picture containers
//     const populatePictures = () => {
//         const userPicturesContainer = document.getElementById("user-pictures-container");

//         // Clear existing content
//         userPicturesContainer.innerHTML = '';

//         // Iterate through user pictures and create a container for each picture
//         userPictures.forEach((pictureUrl) => {
//             const pictureContainer = document.createElement("div");
//             pictureContainer.className = "picture-container";

//             const pictureElement = document.createElement("img");
//             pictureElement.src = pictureUrl;
//             pictureElement.alt = "User Picture";

//             pictureContainer.appendChild(pictureElement);
//             userPicturesContainer.appendChild(pictureContainer);
//         });
//     };

//     // Call the function to populate pictures when the component mounts
//     React.useEffect(() => {
//         populatePictures();
//     }, []);

//     return (
//         <div className="container">
//             <div className="sidebar">
//                 <img src="/SPRINT2/frontend/img/navbar.png" alt="logo" />
//                 <ul>
//                     <li><a href="/SPRINT2/frontend/home/home.html"><span><img src="/SPRINT2/frontend/img/home.png" alt="Home" /></span> HOME</a></li>
//                     <li><a href="/SPRINT2/frontend/profile/profile.html"><span><img src="/SPRINT2/frontend/img/profile.png" alt="Profile" /></span> PROFILE</a></li>
//                     <li><a href="#"><span><img src="/SPRINT2/frontend/img/post.png" alt="Post" /></span> POST</a></li>
//                     <li><a href="/SPRINT2/frontend/settings/settings.html"><span><img src="/SPRINT2/frontend/img/settings.png" alt="Settings" /></span> SETTINGS</a></li>
//                 </ul>
//                 <div className="logout">Log Out</div>
//             </div>
//             <div className="main-content">
//                 <div className="top-bar">
//                     <input type="text" placeholder="Search" />
//                 </div>
//                 <div className="feed-container">
//                     {/* Feed container content goes here */}
//                 </div>
//                 <div className="feed">
//                     {/* Feed content goes here */}
//                     <div className="user-info">
//                         <div className="username">
//                             <h3>username</h3>
//                         </div>
//                         <div className="follow-button-container">
//                             {/* Follow button goes here */}
//                             <button id="followButton" className="follow-button" onClick={toggleFollow}>
//                                 {isFollowing ? 'Following' : 'Follow'}
//                             </button>
//                         </div>
//                         <div className="profile-picture-container">
//                             <img src="/SPRINT2/frontend/img/profiledog.jpg" alt="Profile Picture" className="profile-picture" />
//                         </div>
//                     </div>
//                     <div className="follower-following">
//                         <p>100 Followers</p>
//                         <p>50 Following</p>
//                     </div>
//                     <div className="profile-details">
//                         <h4>USER Profile Details</h4>
//                         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod semper libero, vitae fermentum magna elementum vel. Sed vestibulum lacus ut libero sagittis, id rhoncus nunc ultricies. In auctor est vitae nunc efficitur, vel eleifend dolor vestibulum.</p>
//                     </div>
//                     {/* JSX Structure */}
//                     <div className="user-pictures-container" id="user-pictures-container">
//                         {/* Pictures will be dynamically added here */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserProfile;
