import { Link } from 'react-router-dom';
import PricelistManagement from '../pricelist/PricelistManagement';
import TaskList from '../tasks/Tasklist';

const ManagerComponent = () => {
    return (
        <div>
            <h3>Manager Dashboard</h3>
            <p>Here you can oversee team performance and projects.</p>
            <PricelistManagement />
            <TaskList user={{ role: { name: 'manager' } }} />
            <Link to="/user-management">
                <button className="btn btn-primary">Manage Users</button>
            </Link>
            <Link to="/calendar">
                <button className="btn btn-info">View Calendar</button>
            </Link>
        </div>
    );
};

export default ManagerComponent;