import React from 'react';
import TaskList from './Tasklist';

const ManagerComponent = () => {
    return (
        <div>
            <h3>Manager Dashboard</h3>
            <p>Here you can oversee team performance and projects.</p>
            <TaskList user={{ role: { name: 'manager' } }} />
            {/* Add more manager-specific functionality here */}
        </div>
    );
};

export default ManagerComponent;