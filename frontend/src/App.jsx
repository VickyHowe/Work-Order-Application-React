import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import Dashboard from "./components/Dashboard";
import RequestPasswordReset from "./components/RequestPasswordReset";
import ResetPassword from "./components/ResetPassword";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import UserManagement from "./components/UserManagement";
import TaskList from "./components/Tasklist";
import PricelistManagement from "./components/PricelistManagement";
import Pricelist from "./components/Pricelist";
import CalendarView from "./components/CalendarView";
import WorkOrderList from "./components/WorkOrderList";

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null); // Clear user data on logout
    localStorage.removeItem("token"); // Optionally clear token from local storage
  };

  return (
    <Router>
      <div className="container mx-auto">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
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
            element={<RequestPasswordReset />}
            user={user}
            allowedRoles={["employee", "manager", "admin"]}
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
                element={<CalendarView user={user}/>}
                user={user}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/work-orders"
            element={
              <ProtectedRoute
                element={<WorkOrderList user={user} />} // Pass user to WorkOrderList
                user={user}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/task-list" // Add route for TaskList
            element={
              <ProtectedRoute element={<TaskList user={user} />} user={user}                 
              onLogout={handleLogout}/>
              
            }
          />
          <Route
            path="/pricelist-management"
            element={
              <ProtectedRoute element={<PricelistManagement />} user={user}                 onLogout={handleLogout}/>
            }
          />
          <Route
            path="/pricelist"
            element={
              <ProtectedRoute element={<PricelistManagement />} user={user}                 onLogout={handleLogout}/>
            }
          />{" "}
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute element={<UserManagement />} user={user} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
