import React from 'react';
import { Link } from 'react-router-dom';
import workOrderImage from '../../assets/img03_workorder.jpg'; 

const WorkOrderCard = ({ userRole }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full h-64 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${workOrderImage})` }}
      />
      <div className="relative z-10 p-4">
        <Link to="/work-orders">
          <button className="bg-secondary-light text-black mt-8 p-2 w-full rounded-md hover:bg-blue-600">
            Manage Work Orders
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WorkOrderCard;