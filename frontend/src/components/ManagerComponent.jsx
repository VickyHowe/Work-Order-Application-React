import React from 'react';
import { Link } from 'react-router-dom';
import TaskManagement from './TaskManagement';
import PricelistManagement from './PricelistManagement';
import TaskList from './Tasklist';

const ManagerComponent = () => {
    return (
        <div>
            <h3>Manager Dashboard</h3>
            <p>Here you can oversee team performance and projects.</p>
            <TaskManagement />
            <PricelistManagement />
            <TaskList user={{ role: { name: 'manager' } }} />
            <Link to="/user-management">
                <button className="btn btn-primary">Manage Users</button>
            </Link>
            {/* Add more manager-specific functionality here */}
        </div>
    );
};

export default ManagerComponent;