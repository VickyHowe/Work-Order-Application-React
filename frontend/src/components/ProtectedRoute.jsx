import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, user }) => {
    console.log('ProtectedRoute rendered with user:', user);

    if (!user) {
        console.log('User  is not logged in, redirecting to login.');
        return <Navigate to="/login" />;
    }

    console.log('User  is authorized, rendering the protected component.');
    return element; 
};



export default ProtectedRoute;