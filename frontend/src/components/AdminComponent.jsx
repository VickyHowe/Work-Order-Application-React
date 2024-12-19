import React from 'react';
import { Link } from 'react-router-dom';
import TaskList from './Tasklist';

const AdminComponent = () => {
    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome to the admin dashboard!</p>
            <TaskList user={{ role: { name: 'admin' } }} /> 
            <Link to="/user-management">
                <button className="btn btn-primary">Manage Users</button>
            </Link>
            {/* Other admin functionalities can go here */}
        </div>
    );
};

export default AdminComponent;