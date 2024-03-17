import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import useSearch from "../components/searchbar/useSearch";
import "../style/profile.css";
import "../style/searchbar.css";
import "../style/sidebar.css";
import "../style/popuppost.css";
import "../style/popupcomment.css";


const Profile = () => {
  const [PopupPostVisible, setPopupPostVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const navigate = useNavigate();
  const [followers] = useState(0); // Alusta nykyisten seuraajien määrä
  const [following] = useState(0); // Alusta seurattujen määrä
  const { username, profilePicture, bioText, setBioText } =
    useContext(UserContext); // Get username, profile picture, and bio text from UserContext

  const ProfilePictures = [
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
    "/img/feed.jpg",
  ];

  useEffect(() => {
    populatePictures();
  }, []);

  const populatePictures = () => {
    const ProfilePicturesContainer = document.getElementById(
      "profilepage-feed-pictures-container"
    );

    if (ProfilePicturesContainer) {
      ProfilePicturesContainer.innerHTML = "";

      // Iterate through Profile pictures and create container for each picture
      ProfilePictures.forEach((pictureUrl) => {
        const profilepagepictureContainer = document.createElement("div");
        profilepagepictureContainer.className =
          "profilepage-feed-picture-container";

        const profilepagepictureElement = document.createElement("img");
        profilepagepictureElement.src = pictureUrl;
        profilepagepictureElement.alt = "Profile Picture";

        profilepagepictureContainer.appendChild(profilepagepictureElement);
        ProfilePicturesContainer.appendChild(profilepagepictureContainer);
      });
    } else {
      console.error("Profile pictures container not found");
    }
  };

    const openPopupPost = () => {
      setPopupPostVisible(true);
    };

    const handleSubmit = () => {
      if (selectedImage) {
        const newItem = { image: selectedImage, text: selectedText };
        setSelectedImage(null);
        setSelectedText("");
        setPopupPostVisible(false);
      }
    };

  
  const [searchTerm, setSearchTerm, handleKeyPress] = useSearch('', (term) => {
    // Handle search logic here, if needed
  }, navigate);

    const handlePostClick = () => {
      // Ohjataan käyttäjä kotisivulle ja avataan postauspop-up
      navigate("/home"); // Käytetään navigate-funktiota
      setPopupPostVisible(true);
    };


  return (
      <div className="profile-page-container">
        <div className="sidebar">
          <img srcSet="/img/navbar.png" alt="logo" />
          <ul>
            <li>
              <a href="../home">HOME</a>
            </li>
            <li>
              <a href="../profile">PROFILE</a>
            </li>
            <li>
              <a onClick={handlePostClick}>POST</a>
            </li>
            <li>
              <a href="../settings">SETTINGS</a>
            </li>
          </ul>
          <div className="logout">
            <a href="/login">Log Out</a>
          </div>
        </div>

        <div className="profile-page-main-content">
        <div className="search-bar">
            {/* Use handleKeyPress function to trigger search on Enter key press */}
            <input type="text" placeholder="Search" onKeyPress={handleKeyPress} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="profile-page-feed">
            <div className="profilepage-info">
              <div className="profilepage-username">
                <h2>
                  {username}
                  <br />
                  <div className="profilepage-follower-following">
                    <h3>{followers} Followers </h3>
                    <h3>{following} Following</h3>
                  </div>
                  <p>
                    {bioText}
                    {/* muista lisätä div ja funktio joka hakee tiedot tietokannasta */}
                  </p>
                </h2>
              </div>

              <div className="profilepage-profilepicture-container">
                <img
                  src={profilePicture}
                  alt="profilepage Picture"
                  className="profilepage-profilepicture"
                />
              </div>
            </div>

            <div className="profilepage-details">
              <h4></h4>
              <h2 className="line2"></h2>
            </div>

            <div
              className="profilepage-feed-pictures-container"
              id="profilepage-feed-pictures-container"
            >
              {ProfilePictures.map((pictureUrl, index) => (
                <div className="profilepage-feed-picture-container" key={index}>
                  <img
                    src={pictureUrl}
                    alt={`Feed Picture ${index + 1}`}
                    className="profilepage-feed-image"
                  />
                </div>
              ))}
            </div>

          
            </div>
          </div>
  
      </div>
  );
};

export default Profile;
