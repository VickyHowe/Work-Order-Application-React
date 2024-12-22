import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityQuestionAnswer, setSecurityQuestionAnswer] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Function to validate email format
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate email format
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        // Prepare the data to be sent to the server
        const userData = {
            username,
            email, 
            password,
            securityQuestion,
            securityQuestionAnswer,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                console.error('Registration failed:', errorData);
                setError(errorData.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('An error occurred:', err);
            setError('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl mb-4">Register</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-2 mb-4 w-full"
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <input
                type="text"
                placeholder="Security Question (e.g., What is your mother's maiden name?)"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                className="border p-2 mb-4 w-full"
                required
            />
            <input
                type="text"
                placeholder="Security Question Answer"
                value={securityQuestionAnswer}
                onChange={(e) => setSecurityQuestionAnswer(e.target.value)}
                className="border p-2 mb-4 w-full"
                required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 w-full">Register</button>
        </form>
    );
};

export default Register;