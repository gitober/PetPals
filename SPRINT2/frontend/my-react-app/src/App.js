import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import UserProfile from "./pages/userprofile";
import { UserProvider } from "./context/UserContext";

function App() {
  const isAuthenticated = Boolean(localStorage.getItem("token")) || Boolean(localStorage.getItem("refresh_token"));


  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/home" element={<Home />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
