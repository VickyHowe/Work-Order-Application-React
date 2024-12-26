import TaskList from '../tasks/Tasklist';
import { Link } from 'react-router-dom';

const EmployeeComponent = () => {
    return (
        <div>
            <h3>User Dashboard</h3>
            <p>Here you can view your profile and settings.</p>
            <TaskList user={{ role: { name: 'employee' } }} />
            <Link to="/calendar">
                <button className="btn btn-info">View Calendar</button>
            </Link>
        </div>
    );
};

export default EmployeeComponent;