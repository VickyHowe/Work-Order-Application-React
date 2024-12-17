import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import Dashboard from "./components/Dashboard";
import RequestPasswordReset from "./components/RequestPasswordReset";
import ResetPassword from "./components/ResetPassword";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="container mx-auto">
        <Navbar user={user} onLogout={() => setUser(null)} />
        <h1>Work Order App</h1>
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
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} user={user} />}
          />
          <Route
            path="/request-password-reset"
            element={<RequestPasswordReset />}
          />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
