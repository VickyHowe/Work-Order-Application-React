import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
        navigate('/login');
    };

    // Check if user is defined
    if (!user) {
        return <div>Loading...</div>; // Or redirect to login
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl mb-4">Dashboard</h2>
            <p className="mb-2">Welcome, {user.username}!</p>
            <p className="mb-2">User  ID: {user.id}</p>
            <button onClick={handleLogout} className="bg-red-500 text-white p-2 mt-4">
                Logout
            </button>
        </div>
    );
};

export default Dashboard;