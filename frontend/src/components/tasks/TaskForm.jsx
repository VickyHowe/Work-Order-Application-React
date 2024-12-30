import React from "react";

const TaskForm = ({ formData, setFormData, users, onSubmit, fieldErrors }) => {
  console.log("Users in TaskForm:", users);
  return (
    <form onSubmit={onSubmit}>
      <label className="block mb-1">Task Title</label>
      <input
        type="text"
        placeholder="Enter task title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        className={`border p-2 mb-2 w-full ${fieldErrors.title ? 'border-red-500' : ''}`}
      />
      <label className="block mb-1">Description</label>
      <textarea
        placeholder="Enter task description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
        className={`border p-2 mb-2 w-full ${fieldErrors.description ? 'border-red-500' : ''}`}
      />
      <label className="block mb-1">Deadline</label>
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        required
        className={`border p-2 mb-2 w-full ${fieldErrors.deadline ? 'border-red-500' : ''}`}
      />
      <label className="block mb-1">Resources (comma separated)</label>
      <input
        type="text"
        placeholder="Enter resources (comma separated)"
        value={formData.resources}
        onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
        className="border p-2 mb-2 w-full"
      />
      <label className="block mb-1">Assigned To</label>
      <select
        value={formData.assignedUserId} 
        onChange={(e) => {
          const selectedUserId = e.target.value;
          const selectedUser = users.find(user => user._id === selectedUserId); 
          setFormData({ 
            ...formData, 
            assignedUserId: selectedUserId, 
            username: selectedUser  ? selectedUser .username : "" 
          });
        }}
        required
        className={`border p-2 mb-2 w-full ${fieldErrors.assignedUserId ? 'border-red-500' : ''}`}
      >
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.username}
          </option>
        ))}
      </select>
      <label className="block mb-1">Status</label>
      <select
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        className="border p-2 mb-2 w-full"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </form>
  );
};

export default TaskForm;