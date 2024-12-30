import React from "react";

const TaskDetails = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="p-4 bg-white text-black shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-2">{task.title}</h2>
      <p className="mb-2">
        <strong>Description:</strong> {task.description}
      </p>
      <p className="mb-2">
        <strong>Deadline:</strong>{" "}
        {new Date(task.deadline).toLocaleDateString()}
      </p>
      <p className="mb-2">
        <strong>Resources:</strong> {task.resources.join(", ")}
      </p>
      <p className="mb-2">
        <strong>Assigned To:</strong>{" "}
        {task.user ? task.user.username : "Unassigned"}
      </p>
      <p className="mb-2">
        <strong>Status:</strong> {task.status}
      </p>
      <button
        onClick={onClose}
        className="mt-4 bg-secondary-light text-black border-black p-2 rounded"
      >
        Close
      </button>
    </div>
  );
};

export default TaskDetails;
