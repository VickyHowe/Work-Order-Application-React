import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import AdminComponent from '../dashboard/AdminComponent';
import ManagerComponent from '../dashboard/ManagerComponent';
import EmployeeComponent from '../dashboard/EmployeeComponent';
import CustomerComponent from '../dashboard/CustomerComponent';

const Dashboard = ({ onLogout }) => {
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
                console.log(response);
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
        <div className="w-full text-center mx-auto mt-10">
            <h2 className="mb-2">Welcome, {userData.username}!</h2>
            <div className="mt-4">
                {renderRoleBasedComponent()}
            </div>
        </div>
    );
};

export default Dashboard;