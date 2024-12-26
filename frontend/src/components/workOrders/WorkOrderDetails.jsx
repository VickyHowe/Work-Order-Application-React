// src/components/workOrders/WorkOrderDetails.js
import React from "react";
import { Modal, Button } from "react-bootstrap";
import TaskForm from "../tasks/TaskForm"; // Reusable TaskForm component

const WorkOrderDetails = ({ order, onClose, onUpdate }) => {
  const handleUpdate = (updatedOrder) => {
    onUpdate(updatedOrder);
    onClose();
  };

  return (
    <Modal show={!!order} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Work Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {order ? (
          <TaskForm formData={order} setFormData={handleUpdate} onSubmit={handleUpdate} />
        ) : (
          <p>No order selected.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleUpdate(order)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WorkOrderDetails;