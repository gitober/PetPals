import React, { useContext } from "react";
import { UserContext } from "../../user-context/hooks/UserContext";
import "../../../style/search-bar.css";

const Sidebar = ({ openPopupPost }) => {
  const { handleLogout } = useContext(UserContext);

  return (
    <div className="sidebar" style={{ padding: 0, margin: 0 }}>
      <img srcSet="/img/navbar.png" alt="logo" />
      <ul>
        <li>
          <a href="/home">HOME</a>
        </li>
        <li>
          <a href="/profile">PROFILE</a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openPopupPost();
            }}
          >
            POST
          </a>
        </li>
        <li>
          <a href="/settings">SETTINGS</a>
        </li>
      </ul>
      <div className="logout">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Log Out
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
