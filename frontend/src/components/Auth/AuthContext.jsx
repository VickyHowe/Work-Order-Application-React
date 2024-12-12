import React, { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser ] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token } = response.data;

      // Store the token in localStorage or context
      localStorage.setItem('token', token);
      setUser ({ email }); // You can expand this to include more user data if needed
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials'); // Handle error appropriately
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser (null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
