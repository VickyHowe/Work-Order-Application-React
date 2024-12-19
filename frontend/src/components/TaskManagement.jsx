import React, { useState } from 'react';
import axios from 'axios';

const TaskManagement = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [resources, setResources] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tasks`, {
                title,
                description,
                deadline,
                resources: resources.split(',').map(item => item.trim()), // Convert to array
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // Handle success (e.g., show a success message or reset form)
        } catch (err) {
            setError('Error creating task');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
            <input type="text" placeholder="Resources (comma separated)" value={resources} onChange={(e) => setResources(e.target.value)} />
            <button type="submit">Create Task</button>
            {error && <p > className="text-red-500">{error}</p>}
        </form>
    );
};

export default TaskManagement;