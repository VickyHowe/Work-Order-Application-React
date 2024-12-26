// src/components/tasks/TaskForm.js
import React from "react";

const TaskForm = ({ formData, setFormData, users, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <label className="block mb-1">Task Title</label>
      <input
        type="text"
        placeholder="Enter task title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        className="border p-2 mb-2 w-full"
      />
      <label className="block mb-1">Description</label>
      <textarea
        placeholder="Enter task description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
        className="border p-2 mb-2 w-full"
      />
      <label className="block mb-1">Deadline</label>
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        required
        className="border p-2 mb-2 w-full"
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
        onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
        required
        className="border p-2 mb-2 w-full"
      >
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.username}
          </option>
        ))}
      </select>
    </form>
  );
};

export default TaskForm;