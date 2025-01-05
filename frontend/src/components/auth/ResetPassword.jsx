import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/reset-password`, 
                { newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}` 
                    }
                }
            );
            alert('Password has been reset successfully');
            navigate('/login');
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Error resetting password');
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
            />
            <button type="submit">Reset Password</button>
        </form>
    );
};

export default ResetPassword;