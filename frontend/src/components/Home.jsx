import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../assets/img01_wo_main.jpg';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Stay Organized!</h1>
      <p className="mb-4 pl-4">Streamline the management of tasks and work orders across your organization.</p>
      <div className="relative flex justify-center">
        <img 
          src={Image} 
          alt="Person with notepad hovering over desk with files, laptop and cup of coffee"
          className="rounded-lg shadow-lg w-1/2 h-auto" 
        />
        <Link to="/login">
          <button className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-secondary-dark text-black p-2 rounded-md hover:bg-primary-dark">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;