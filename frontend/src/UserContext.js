// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context with 'null' as the default value
const AuthContext = createContext(null);

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    // Save user data to local storage or cookies if needed
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // Remove user data from local storage or cookies if needed
    localStorage.removeItem('user');
    window.location = '/login';
  };

  useEffect(() => {
    // Check if user data is available in local storage or cookies on initial load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);