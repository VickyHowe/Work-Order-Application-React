import React from 'react';
import TaskList from './Tasklist';

const EmployeeComponent = () => {
    return (
        <div>
            <h3>User Dashboard</h3>
            <p>Here you can view your profile and settings.</p>
            <TaskList user={{ role: { name: 'employee' } }} />
            {/* Add more user-specific functionality here */}
        </div>
    );
};

export default EmployeeComponent;