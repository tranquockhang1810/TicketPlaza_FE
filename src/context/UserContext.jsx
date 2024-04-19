'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../app/api/api';
import ApiPath from '../app/api/apiPath';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [id, setID] = useState(localStorage.getItem("user"))

  const fetchUserData = async () => {
    try {
      const params = {
        userId: id
      }
      const res = await api.get(ApiPath.GET_USER_INFO, { params });
      if (!!res?.data) {
        setUser(res?.data[0]?.data[0]);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [token]);

  const onSignIn = (userData) => {
    const accessToken = userData?.token;
    const profile = userData?.data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", profile?._id);
    setToken(accessToken);
    setID(profile?._id);
    setUser(profile);
  };

  const onSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setID(null)
    setUser(null);
  };

  const isAuthenticated = () => {
    const storedUser = localStorage.getItem("user");
    return !!storedUser && !!user;
  };

  const isAdmin = () => {
    return user && user?.type !== 0;
  };

  const isSuperAdmin = () => {
    return user && user?.type === 2;
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      onSignIn, 
      onSignOut,
      isAuthenticated,
      isAdmin,
      isSuperAdmin,
      fetchUserData
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
