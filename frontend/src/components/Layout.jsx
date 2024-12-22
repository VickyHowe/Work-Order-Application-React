import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const { theme } = useTheme(); 

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-200 text-black' : 'bg-gray-800 text-white'}`}>
      <div className={`${theme === 'light' ? 'text-black' : 'text-white'}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;