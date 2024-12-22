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
            <Link to="/calendar">
                <button className="btn btn-info">View Calendar</button>
            </Link>
        </div>
    );
};

export default AdminComponent;
