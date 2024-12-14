import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State to hold error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state before attempting login

    try {
      console.log('Attempting to log in with:', email, password); // Debugging line
      await login(email, password); // Attempt to log in
      console.log('Login successful, redirecting to dashboard...'); // Debugging line
      navigate('/'); // Redirect to dashboard or another page after successful login
    } catch (err) {
      setError(err.message); // Set the error message if login fails
      console.error('Login error:', err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message if any */}
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;