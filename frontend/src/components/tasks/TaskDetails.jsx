// src/components/tasks/TaskDetails.js
import React from "react";

const TaskDetails = ({ task, onClose }) => {
  if (!task) return null; // If no task is provided, return null

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-2">{task.title}</h2>
      <p className="mb-2"><strong>Description:</strong> {task.description}</p>
      <p className="mb-2"><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
      <p className="mb-2"><strong>Resources:</strong> {task.resources.join(", ")}</p>
      <p className="mb-2"><strong>Assigned To:</strong> {task.assignedUser  ? task.assignedUser .username : 'Unassigned'}</p>
      <button onClick={onClose} className="mt-4 bg-blue-500 text-white p-2 rounded">
        Close
      </button>
    </div>
  );
};

export default TaskDetails;