"use client"
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);


  const onSignIn = (userData) => {
    const accessToken = userData?.token;
    const profile = userData?.data;

    localStorage.setItem("token", accessToken);
    setToken(accessToken);
    setUser(profile);
  };

  const onSignOut = () => {
    localStorage.removeItem('token');
    setToken("");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      token,
      onSignIn, 
      onSignOut 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

