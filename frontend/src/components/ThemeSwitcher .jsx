import React from 'react';
import { useTheme } from '../context/ThemeContext'; 
import { FaSun, FaMoon } from 'react-icons/fa'; 

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded transition-colors duration-300 ${
        theme === 'light' ? 'bg-blue-200 text-black' : 'bg-gray-800 text-white'
      }`}
    >
      {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
    </button>
  );
};

export default ThemeSwitcher;