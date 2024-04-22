'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../app/api/api';
import ApiPath from '../app/api/apiPath';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(
    typeof window !== 'undefined' ? localStorage.getItem("token") : null
  );

  useEffect(() => {
    const id = localStorage.getItem("user");
    if (id) fetchUserData(id);
  }, [token]);

  const fetchUserData = async (id) => {
    try {
      const params = { userId: id };
      const res = await api.get(ApiPath.GET_USER_INFO, { params });
      setUser(res?.data[0]?.data[0] || null);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const onSignIn = (userData) => {
    const accessToken = userData?.token;
    const profile = userData?.data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", profile?._id);
    setToken(accessToken);
    fetchUserData(profile?._id);
  };

  const onSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const [user, setUser] = useState(null);

  const isAuthenticated = () => {
    const storedUser = user;
    return !!storedUser;
  };

  const isAdmin = () => {
    return user && user.type !== 0;
  };

  const isSuperAdmin = () => {
    return user && user.type === 2;
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      onSignIn, 
      onSignOut,
      isAuthenticated,
      isAdmin,
      isSuperAdmin,
      fetchUserData,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
