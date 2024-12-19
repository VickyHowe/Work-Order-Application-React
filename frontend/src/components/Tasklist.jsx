import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tasks`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setTasks(response.data);
        };

        fetchTasks();
    }, []);

    const handleDelete = async (id) => {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        setTasks(tasks.filter(task => task._id !== id));
    };

    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <h2>Current Tasks</h2>
            <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 mb-4 w-full"
            />
            <ul>
                {filteredTasks.map(task => (
                    <li key={task._id} className="flex justify-between items-center mb-2">
                        <div>
                            <h3 className="font-bold">{task.title}</h3>
                            <p>{task.description}</p>
                        </div>
                        <div>
                            {user.role.name !== 'customer' && ( // Only show delete button for non-customers
                                <button onClick={() => handleDelete(task._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                            )}
                            {/* Add Edit button functionality here, conditionally render based on role */}
                        </div>
                    </li>
                ))}
            </ul>
            {['manager', 'admin'].includes(user.role.name) && ( // Show create task button for managers and admins
                <button className="bg-blue-500 text-white p-2 mt-4">Create Task</button>
            )}
        </div>
    );
};

export default TaskList;