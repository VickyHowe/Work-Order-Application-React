import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { FaPlus, FaEye, FaEyeSlash, FaSave } from "react-icons/fa";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import WorkOrderList from "../workOrders/WorkOrderList";
import useFetchWorkOrders from "../../hooks/useFetchWorkOrders";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import TaskForm from "../tasks/TaskForm"; 
const localizer = momentLocalizer(moment);

const CalendarView = ({ user }) => {
  const token = localStorage.getItem("token");
  const { workOrders, fetchWorkOrders } = useFetchWorkOrders(token);
  const [showWorkOrderList, setShowWorkOrderList] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "",
    priority: "medium",
  });
  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    description: false,
    deadline: false,
    assignedUserId: false,
  });

  CalendarView.propTypes = {
    user: PropTypes.object.isRequired,
  };

  // Create events from workOrders
  const events = workOrders.map((order) => ({
    _id: order._id,
    title: order.title,
    start: new Date(order.deadline),
    end: new Date(order.deadline),
    allDay: true,
  }));

  const handleSelectEvent = (event) => {
    const order = events.find((e) => e._id === event._id);
    if (order) {
      console.log("Selected Order from Calendar:", order);
      setSelectedOrder(order);
      setShowWorkOrderList(true);
    } else {
      console.log("No order found.");
    }
  };

  const handleCreateOrder = async () => {
    const errors = {
      title: !newOrder.title,
      description: !newOrder.description,
      deadline: !newOrder.deadline,
      assignedUserId: !newOrder.assignedUserId,
    };
  
    setFieldErrors(errors);
  
    if (Object.values(errors).some((error) => error)) {
      console.error("Please fill in all required fields.");
      return;
    }
  
    try {
      const response = await apiCall("/api/workorders/request", "post", newOrder);
      setWorkOrders((prevOrders) => [...prevOrders, response]);
      setShowCreateModal(false);
      setNewOrder({ title: "", description: "", deadline: "", status: "", priority: "medium" });
    } catch (error) {
      console.error("Error creating work order:", error);
    }
  };

  return (
    <div className="p-4">
      <div>
        <button
          className="mb-4 bg-secondary-dark text-black px-4 py-2 rounded"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus /> Create Work Order
        </button>
      </div>

      {/* Modal for Creating Work Order */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Create New Work Order</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <TaskForm
      formData={newOrder}
      setFormData={setNewOrder}
      onSubmit={handleCreateOrder}
      fieldErrors={fieldErrors} // Pass fieldErrors here
    />
  </Modal.Body>
  <Modal.Footer>
    <button
      className="bg-gray-300 text-black px-3 py-1 rounded"
      onClick={() => setShowCreateModal(false)}
    >
      Close
    </button>
    <button
      className="bg-green-500 text-white px-3 py-1 rounded"
      onClick={handleCreateOrder}
    >
      <FaSave /> Create Work Order
    </button>
  </Modal.Footer>
</Modal>

      <button
        className="mb-4 bg-secondary-light text-black px-4 py-2 rounded flex items-center justify-center space-x-2"
        onClick={() => setShowWorkOrderList(!showWorkOrderList)}
      >
        {showWorkOrderList ? (
          <>
            <FaEyeSlash />
            <span>Hide Work Orders</span>
          </>
        ) : (
          <>
            <FaEye />
            <span>Show Work Orders </span>
          </>
        )}
      </button>
      {showWorkOrderList && (
        <div className="mb-4">
          <WorkOrderList
            user={user}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            fetchWorkOrders={fetchWorkOrders}
          />
        </div>
      )}
      <div className="bg-primary-light text-black shadow-md rounded-lg overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </div>
  );
};

export default CalendarView;