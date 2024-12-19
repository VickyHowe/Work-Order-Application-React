import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, user }) => {
    console.log('ProtectedRoute rendered with user:', user);

    // Check if the user is logged in
    if (!user) {
        console.log('User  is not logged in, redirecting to login.');
        return <Navigate to="/login" />;
    }
    // const userRole = user.role.name; // Assuming user.role.name gives the role name
    // if (!allowedRoles.includes(userRole)) {
    //     return <Navigate to="/dashboard" />; // Redirect to dashboard if not allowed
    // }

    console.log('User  is authorized, rendering the protected component.');
    return element; // Render the protected component
};

export default ProtectedRoute;