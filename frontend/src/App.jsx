import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthContext';
import Dashboard from './components/Dashboard/Dashboard';
import Schedule from './components/Schedule/Schedule';
import Pricing from './components/Pricing/Pricing';
import Tasks from './components/Tasks/Tasks';
import Resources from './components/Resources/Resources';
import Reports from './components/Reports/Reports';
import Customers from './components/Customers/Customers';
import Login from './components/Login/Login'; // Import the Login component

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/login" element={<Login />} /> {/* Include the Login component */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;