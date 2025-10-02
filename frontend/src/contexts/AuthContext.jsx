import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for stored user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('videoFlowUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = (userData) => {
    setUser(userData);
    localStorage.setItem('videoFlowUser', JSON.stringify(userData));
  };

  const signUp = (userData) => {
    setUser(userData);
    localStorage.setItem('videoFlowUser', JSON.stringify(userData));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('videoFlowUser');
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};