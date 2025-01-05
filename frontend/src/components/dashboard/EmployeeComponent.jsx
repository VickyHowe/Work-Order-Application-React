import TaskList from '../tasks/Tasklist';
import { Link } from 'react-router-dom';
import WorkOrderCard from '../workOrders/WorkOrderCard';

const EmployeeComponent = ({userRole}) => {
    return (
        <div>
            <h3>User Dashboard</h3>
            <p>Here you can view your profile and settings.</p>
                    {/* Work Order Card */}
        <WorkOrderCard userRole={userRole} />
            <TaskList user={{ role: { name: 'employee' } }} />
            <Link to="/calendar">
                <button className="btn btn-info">View Calendar</button>
            </Link>
        </div>
    );
};

export default EmployeeComponent;