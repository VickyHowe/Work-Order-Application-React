import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios'; // Import Axios
import AdminComponent from './AdminComponent'; // Import your admin component
import ManagerComponent from './ManagerComponent'; // Import your manager component
import EmployeeComponent from './EmployeeComponent'; // Import your user component
import CustomerComponent from './CustomerComponent';

const Dashboard = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
        navigate('/login');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>No user data available.</div>;
    }

    const renderRoleBasedComponent = () => {
        console.log('Userdata',userData);

        switch (userData.role.name) {
            case 'admin':
                return <AdminComponent />;
            case 'manager':
                return <ManagerComponent />;
            case 'user':
                return <EmployeeComponent />;
            case 'customer':
                return <CustomerComponent />;
            default:
                return <div>Unauthorized role</div>;
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl mb-4">Dashboard</h2>
            <p className="mb-2">Welcome, {userData.username}!</p>
            <p className="mb-2">User  ID: {userData._id}</p>
            <div className="mt-4">
                <Button onClick={handleLogout} variant="danger" className="me-2">
                    Logout
                </Button>
            </div>
            <div className="mt-4">
                {renderRoleBasedComponent()}
            </div>
        </div>
    );
};

export default Dashboard;