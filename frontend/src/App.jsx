import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import Dashboard from './components/Dashboard'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar'; 

const App = () => {
    const [user, setUser ] = useState(null); // Initialize user state

    return (
        <Router>
            <div className="container mx-auto">
                <Navbar user={user} onLogout={() => setUser (null)} />
                <h1>Work Order App</h1>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setUser ={setUser } />} />
                    <Route path="/profile" element={user ? <UserProfile user={user} /> : <Navigate to="/login" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;