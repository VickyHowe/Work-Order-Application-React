import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import Dashboard from "./components/Dashboard";
import RequestPasswordReset from "./components/RequestPasswordReset";
import ResetPassword from "./components/ResetPassword";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import UserManagement from "./components/UserManagement";
import TaskList from "./components/Tasklist";
import TaskManagement from "./components/TaskManagement";
import PricelistManagement from "./components/PricelistManagement";
import Pricelist from './components/Pricelist';

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
              />
            }
          />
          <Route
            path="/task-management"
            element={
              <ProtectedRoute element={<TaskManagement />} user={user} />
            }
          />
          <Route
            path="/pricelist-management"
            element={
              <ProtectedRoute element={<PricelistManagement />} user={user} />
            }
          />
          <Route
            path="/pricelist"
            element={
              <ProtectedRoute element={<PricelistManagement />} user={user} />
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
