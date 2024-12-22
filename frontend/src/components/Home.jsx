import React from 'react';
import { Button } from 'react-bootstrap'; 
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
          className="rounded-lg shadow-lg w-1/4 h-auto" 
        />
        <Button 
          as={Link} 
          to="/login" 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white" 
          variant="primary"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Home;