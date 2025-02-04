import { Link } from "react-router-dom";
import taskListImage from "../../assets/img02_taskList.webp";
import userManagementImage from "../../assets/img04_manageUsers.jpg";
import pricelistManagementImage from "../../assets/img05_pricelist.jpg";
import calendarImage from "../../assets/img03_workorder.jpg";
import reportsImage from "../../assets/img06_reports.jpg";
import WorkOrderCard from '../workOrders/WorkOrderCard';

const ManagerComponent = ({ userRole }) => {
  console.log("User  role in ManagerComponent:", userRole); // Log the user role

  return (
    <div className="mx-auto mt-10 p-6 bg-forms text-black border-gray rounded-lg shadow-md w-full sm:max-w-md md:max-w-lg lg:max-w-4xl">
      <h2 className="text-2xl mb-4 text-center">Manager Dashboard</h2>
      <p className="text-center mb-4">
        Here you can oversee team performance and projects.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card for Task List */}
        <div className="bg-white rounded-lg shadow-md p-6 w-full h-64 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${taskListImage})` }}
          />
          <div className="relative z-10 p-4">
            <Link to="/task-list">
              <button className="bg-secondary-light text-black mt-8 p-2 w-full rounded-md hover:bg-blue-600">
                Manage Task List
              </button>
            </Link>
          </div>
        </div>

        {/* Work Order Card */}
        <WorkOrderCard userRole={userRole} />

        {/* Card for User Management */}
        <div className="bg-white rounded-lg shadow-md p-6 w-full h-64 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${userManagementImage})` }}
          />
          <div className="relative z-10 p-4">
            <Link to="/user-management">
              <button className="bg-secondary-light text-black mt-8 p-2 w-full rounded-md hover:bg-blue-600">
                Manage Users
              </button>
            </Link>
          </div>
        </div>

        {/* Card for Pricelist Management */}
        <div className="bg-white rounded-lg shadow-md p-6 w-full h-64 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${pricelistManagementImage})` }}
          />
          <div className="relative z-10 p-4">
            <Link
              to={{
                pathname: "/pricelist-management",
                state: { userRole },
              }}
              onClick={() =>
                console.log(
                  "Navigating to PricelistManagement with userRole:",
                  userRole
                )
              }
            >
              <button className="bg-secondary-light text-black p-2 mt-8 w-full rounded-md hover:bg-blue-600">
                Manage Pricelist
              </button>
            </Link>
          </div>
        </div>

        {/* Card for Reports */}
        <div className="bg-white rounded-lg shadow-md p-6 w-full h-64 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${reportsImage})` }}
          />
          <div className="relative z-10 p-4">
            <Link to="/reports">
              <button className="bg-secondary-light text-black p-2 mt-8 w-full rounded-md hover:bg-blue-600">
                View Reports
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerComponent;
