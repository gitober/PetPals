import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import UserProfile from "./pages/userprofile";
import Signup from "./components/popups/useSignup"; // Import the Signup component
import { UserProvider } from "./context/UserContext";

function App() {

  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route index element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/userprofile" element={<UserProfile />} />
          
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
