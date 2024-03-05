import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Haetaan käyttäjänimi localStoragesta tai käytetään oletusarvoa
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "Default Username";
  });

  // Tallennetaan käyttäjänimi localStorageen aina kun se muuttuu
  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
