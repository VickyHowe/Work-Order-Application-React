import React from 'react';
import { Link } from 'react-router-dom';


const AdminComponent = () => {
    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome to the admin dashboard!</p>
            <Link to="/task-list">
                <button className="btn btn-primary">Go to Task List</button>
            </Link>
            <Link to="/user-management">
                <button className="btn btn-primary">Manage Users</button>
            </Link>
            <Link to="/pricelist-management">
                <button className="btn btn-secondary">Manage Pricelist</button>
            </Link>
            {/* Other admin functionalities can go here */}
        </div>
    );
};

export default AdminComponent;
