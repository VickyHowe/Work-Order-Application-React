import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State for error message
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message before making the request
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
    
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            // Set user data in state (assuming setUser  is passed as a prop)
            // setUser ({ id: data.user.id, username: data.user.username });
            // Redirect to the dashboard upon successful registration
            navigate('/dashboard');
        } else {
            // Handle error response
            const errorData = await response.json();
            console.error('Registration failed:', errorData);
            
            // Extract a user-friendly error message
            if (errorData.error) {
                // Check if the error is a duplicate key error
                if (errorData.error.includes('duplicate key error')) {
                    setError('Username already exists. Please choose a different username.');
                } else {
                    setError(errorData.message || 'Registration failed. Please try again.');
                }
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl mb-4">Register</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 mb-4 w-full"
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 mb-4 w-full"
                required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 w-full">Register</button>
        </form>
    );
};

export default Register;
