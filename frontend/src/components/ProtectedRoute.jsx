import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes

const ProtectedRoute = ({ element, user }) => {
    console.log('ProtectedRoute rendered with user:', user);

    // Check if the user is logged in
    if (!user) {
        console.log('User  is not logged in, redirecting to login.');
        return <Navigate to="/login" />;
    }

    // Uncomment and define allowedRoles if you want to implement role-based access
    // const allowedRoles = ['admin', 'manager']; // Example roles
    // const userRole = user.role; // Assuming user.role gives the role name
    // if (!allowedRoles.includes(userRole)) {
    //     return <Navigate to="/dashboard" />; // Redirect to dashboard if not allowed
    // }

    console.log('User  is authorized, rendering the protected component.');
    return element; // Render the protected component
};

// Define prop types for ProtectedRoute
ProtectedRoute.propTypes = {
    element: PropTypes.element.isRequired, // Define element as a required React element
    user: PropTypes.object, // Define user as an object (or specify a more specific shape if needed)
};

export default ProtectedRoute;