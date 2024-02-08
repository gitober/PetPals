import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./components/home"; // Import the Home component
import UserProfile from "./components/userProfile"; // Import the UserProfile component
import Login from "./components/Login"; // Import the Login component
import Profile from "./components/Profile"; // Import the Profile component
import Settings from "./components/Settings"; // Import the Settings component
import NotFound from "./NotFound";
import "./app.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="userprofile" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
