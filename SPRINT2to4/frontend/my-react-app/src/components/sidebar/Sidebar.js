import React from 'react';
import '../../style/sidebar.css';

const Sidebar = ({ openPopupPost }) => (
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
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a onClick={openPopupPost}>POST</a>
      </li>
      <li>
        <a href="../settings">SETTINGS</a>
      </li>
    </ul>
    <div className="logout">
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a onClick={() => window.location.href = "/login"}>Log Out</a>
    </div>
  </div>
);

export default Sidebar;
