import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [resources, setResources] = useState('');
    const [error, setError] = useState('');

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

    const handleCreateTask = async (e) => {
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
            setTasks([...tasks, response.data]); // Add the new task to the list
            setTitle('');
            setDescription('');
            setDeadline('');
            setResources('');
        } catch (err) {
            setError('Error creating task');
        }
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
                            <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                            <p>Resources: {task.resources.join(', ')}</p>
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
            {['manager', 'admin'].includes(user.role.name) && ( // Show create task form for managers and admins
                <div className="mt-4">
                    <h3>Create New Task</h3>
                    <form onSubmit={handleCreateTask} className="mb-4">
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="border p-2 mb-2 w-full"
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="border p-2 mb-2 w-full"
                        />
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            required
                            className="border p-2 mb-2 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Resources (comma separated)"
                            value={resources}
                            onChange={(e) => setResources(e.target.value)}
                            className="border p-2 mb-2 w-full"
                        />
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Task</button>
                        {error && <p className="text-red-500">{error}</p>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default TaskList;