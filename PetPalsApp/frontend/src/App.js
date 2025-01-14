import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import UserProfile from "./pages/user-profile.js";
import Signup from "./features/sign-up/hooks/useSignUp";
import { UserProvider } from "./features/user-context/hooks/UserContext";

function App() {
  return (
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route index element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            {/* Dynamic route for usernames */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/userprofile/:username" element={<UserProfile />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
  );
}

export default App;
