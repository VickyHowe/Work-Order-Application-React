import React, { useState } from "react";

const WorkOrderDetails = ({ order, onClose, onUpdate, onDelete }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedOrder, setEditedOrder] = useState(order);

  const handleSave = () => {
    onUpdate(editedOrder);
    setEditMode(false);
  };

  const handleDelete = () => {
    onDelete(order._id);
    onClose();
  };

  return (
    <div className="p-4 bg-white text-black shadow-md rounded-lg">
      {editMode ? (
        <>
          <input
            value={editedOrder.title}
            onChange={(e) => setEditedOrder({ ...editedOrder, title: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            value={editedOrder.description}
            onChange={(e) => setEditedOrder({ ...editedOrder, description: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
          >
            Save
          </ button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-300 text-black px-3 py-1 rounded"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-2">{order.title}</h2>
          <p className="mb-2">
            <strong>Description:</strong> {order.description}
          </p>
          <p className="mb-2">
            <strong>Deadline:</strong> {new Date(order.deadline).toLocaleDateString()}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(order._id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </>
      )}
      <button onClick={onClose} className="mt-4 bg-gray-200 text-black px-3 py-1 rounded">
        Close
      </button>
    </div>
  );
};

export default WorkOrderDetails;