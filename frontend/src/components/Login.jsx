import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser  }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); 
    
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await response.json();
    
            if (response.ok && data.token) {
                // Set the user state with the role directly
                setUser ({
                    id: data.user.id,
                    username, // Assuming you have a username variable
                    role: data.user.role // This is now a string
                });
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data.user.id,
                    username: data.user.username,
                    role: data.user.role
                }));
                navigate('/Dashboard');
            } else {
                // Handle errors
                if (data.message) {
                    setError(data.message);
                } else if (data.error) {
                    setError(data.error);
                } else {
                    setError('Login failed. Please try again.');
                }
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <form onSubmit={handleSubmit} className="mb-4">
                <h2 className="text-2xl mb-4">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-1">Username</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <button type="submit" className={`bg-blue-500 text-white p-2 w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p className="text-center">
                <Link to="/request-password-reset" className="text-blue-500 hover:underline">
                    Forgot your password?
                </Link>
            </p>
            <p className="text-center mt-4">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-500 hover:underline">
                    Register here
                </Link>
            </p>
        </div>
    );
};

export default Login;