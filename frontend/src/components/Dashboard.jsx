import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import AdminComponent from './AdminComponent';
import ManagerComponent from './ManagerComponent';
import EmployeeComponent from './EmployeeComponent';
import CustomerComponent from './CustomerComponent';

const Dashboard = ({ onLogout }) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
        navigate('/login');
    };
    // Define prop types for Dashboard
Dashboard.propTypes = {
    onLogout: PropTypes.func.isRequired, // Validate that onLogout is a function and is required
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
        switch (userData.role.name) {
            case 'admin':
                return <AdminComponent />;
            case 'manager':
                return <ManagerComponent />;
            case 'employee':
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