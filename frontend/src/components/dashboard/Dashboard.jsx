import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../../hooks/useApi'; // Import the useApi hook
import AdminComponent from '../dashboard/AdminComponent';
import ManagerComponent from '../dashboard/ManagerComponent';
import EmployeeComponent from '../dashboard/EmployeeComponent';
import CustomerComponent from '../dashboard/CustomerComponent';

const Dashboard = ({ onLogout }) => {
    const navigate = useNavigate();
    const { apiCall, loading, error } = useApi(); // Use the useApi hook
    const [userData, setUserData] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
        navigate('/login');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await apiCall("/api/users/profile", "get");
                setUserData(response);
                console.log(response);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [apiCall, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>; 
    }

    if (!userData) {
        return <div>No user data available.</div>;
    }

    const renderRoleBasedComponent = () => {
        switch (userData.role.name) {
            case 'admin':
                return <AdminComponent userRole={userData.role.name}/>;
            case 'manager':
                return <ManagerComponent userRole={userData.role.name}/>;
            case 'employee':
                return <EmployeeComponent userRole={userData.role.name}/>;
            case 'customer':
                return <CustomerComponent userRole={userData.role.name} />; 
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