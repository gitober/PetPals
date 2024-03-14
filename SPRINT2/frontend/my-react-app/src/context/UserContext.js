import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Haetaan käyttäjänimi ja bio-teksti localStoragesta tai käytetään oletusarvoja
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });
  const [bioText, setBioText] = useState(() => {
    return localStorage.getItem("bioText") || "";
  });

  // Tallennetaan käyttäjänimi ja bio-teksti localStorageen aina kun ne muuttuvat
  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem("bioText", bioText);
  }, [bioText]);

  return (
    <UserContext.Provider
      value={{ username, setUsername, bioText, setBioText }}
    >
      {children}
    </UserContext.Provider>
  );
};