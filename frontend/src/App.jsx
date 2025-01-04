import "./index.css";
import { useState } from "react";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import UserProfile from "./components/user/UserProfile";
import Dashboard from "./components/dashboard/Dashboard";
import RequestPasswordReset from "./components/auth/RequestPasswordReset";
import ResetPassword from "./components/auth/ResetPassword";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import UserManagement from "./components/user/UserManagement";
import TaskList from "./components/tasks/Tasklist";
import PricelistManagement from "./components/pricelist/PricelistManagement";
import Pricelist from "./components/pricelist/Pricelist";
import CalendarView from "./components/calendar/CalendarView";
import WorkOrderList from "./components/workOrders/WorkOrderList";
import ReportsPage from "./components/reports/Reports";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <Layout>
        <div className="w-full mx-auto">
          <Navbar user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  element={<UserProfile user={user} />}
                  user={user}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/request-password-reset"
              element={
                <ProtectedRoute
                  element={<RequestPasswordReset />}
                  user={user}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  element={<Dashboard user={user} onLogout={handleLogout} />}
                  user={user}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute
                  element={<CalendarView user={user} />}
                  user={user}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/work-orders"
              element={
                <ProtectedRoute
                  element={<WorkOrderList user={user} />}
                  user={user}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/task-list"
              element={
                <ProtectedRoute
                  element={<TaskList user={user} />}
                  user={user}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/pricelist-management"
              element={
                <ProtectedRoute
                  element={<PricelistManagement user={user} />}
                  user={user}
                  onLogout={handleLogout}
                />
              }
            />{" "}
            <Route path="/pricelist" element={<Pricelist user={user} />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/user-management"
              element={
                <ProtectedRoute
                  element={<UserManagement />}
                  user={user}
                  onLogout={handleLogout}
                />
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute
                  element={<ReportsPage />}
                  user={user}
                  onLogout={handleLogout}
                />
              }
            />{" "}
          </Routes>
        </div>
      </Layout>
    </Router>
  );
};

export default App;
