import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { FaPlus, FaEye, FaEyeSlash, FaSave } from "react-icons/fa";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import WorkOrderList from "../workOrders/WorkOrderList";
import WorkOrderDetails from "../workOrders/WorkOrderDetails";
import useFetchWorkOrders from "../../hooks/useFetchWorkOrders";
import { Modal } from "react-bootstrap";
import TaskForm from "../tasks/TaskForm";
import useApi from "../../hooks/useApi";
import useTasks from "../../hooks/useTasks";
import WorkOrderForm from "../workOrders/WorkOrderForm";

const localizer = momentLocalizer(moment);

const CalendarView = ({ user }) => {
  const token = localStorage.getItem("token");
  const { workOrders, setWorkOrders, fetchWorkOrders } =
    useFetchWorkOrders(token);
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks(token);
  const [showWorkOrderList, setShowWorkOrderList] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    title: "",
    description: "",
    deadline: null,
    status: "pending",
    priority: "medium",
  });
  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    description: false,
    deadline: false,
    assignedUserId: false,
  });
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]); 
  const { apiCall } = useApi();

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await apiCall("/api/users/roles");
        const filteredUsers = usersData.filter(
          (user) =>
            user.role.name === "employee" || user.role.name === "manager"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("Work Orders:", workOrders); 
    console.log("Tasks:", tasks);
  }, [workOrders, tasks]);

  workOrders.forEach((order) => {
    console.log(
      "Work Order Deadline:",
      order.deadline,
      new Date(order.deadline)
    );
  });

  tasks.forEach((task) => {
    console.log("Task Deadline:", task.deadline, new Date(task.deadline));
  });

  workOrders.forEach((order) => {
    console.log("Work Order:", order);
    console.log("Start Date:", new Date(order.createdAt));
    console.log("End Date:", new Date(order.deadline));
  });

  // Combine work orders and tasks into events
  useEffect(() => {
    const combinedEvents = [
      ...workOrders.map((order) => ({
        _id: order._id,
        title: order.title,
        start: new Date(order.deadline), 
        end: new Date(order.deadline),   
        allDay: true,
        type: "workOrder", 
      })),
      ...tasks.map((task) => ({
        _id: task._id,
        title: task.title,
        start: new Date(task.deadline), 
        end: new Date(task.deadline),   
        allDay: true,
        type: "task", 
      })),
    ];
    console.log("Combined Events:", combinedEvents);
    setEvents(combinedEvents); 
  }, [workOrders, tasks]);

  // Customize event colors
  const eventPropGetter = (event) => {
    console.log("Event Type:", event.type);
    console.log("Event Details:", event); 
    const backgroundColor =
      event.type === "workOrder" ? "bg-red-500" : "bg-green-500";
    return {
      className: `${backgroundColor} text-white rounded border-none`,
    };
  };

  // Handle event selection
  const handleSelectEvent = (event) => {
    const order = workOrders.find((e) => e._id === event._id);
    if (order) {
      console.log("Selected Order from Calendar:", order);
      setSelectedOrder(order);
      setShowWorkOrderList(true);
    }
  };

  // Handle date selection (create work order)
  const handleSelectSlot = (slotInfo) => {
    setNewOrder({
      ...newOrder,
      deadline: slotInfo.start.toISOString().split("T")[0],
    });
    setShowCreateModal(true);
  };

  // Handle work order creation
const handleCreateOrder = async () => {
  const errors = {
    title: !newOrder.title,
    description: !newOrder.description,
    deadline: !newOrder.deadline,
  };

  if (Object.values(errors).some((error) => error)) {
    const missingFields = Object.keys(errors).filter((key) => errors[key]);
    console.error("Missing required fields:", missingFields.join(", "));
    return;
  }

  const creationDate = new Date();
  const deadlineDate = new Date(newOrder.deadline);

  if (deadlineDate < creationDate) {
    console.error("Deadline date must be after the creation date.");
    return;
  }

  try {
    const response = await apiCall("/api/workorders/request", "post", {
      ...newOrder,
      status: "pending",
    });
    setWorkOrders((prevOrders) => [...prevOrders, response]);
    setShowCreateModal(false);
    setNewOrder({
      title: "",
      description: "",
      deadline: "",
      status: "",
      priority: "medium",
    });
  } catch (error) {
    console.error("Error creating work order:", error);
  }
};

  // Handle work order update
  const handleUpdateOrder = async (updatedOrder) => {
    try {
      const response = await apiCall(
        `/api/workorders/${updatedOrder._id}`,
        "put",
        updatedOrder
      );
      setWorkOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? response : order
        )
      );
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating work order:", error);
    }
  };

  // Handle work order deletion
  const handleDeleteOrder = async (orderId) => {
    try {
      await apiCall(`/api/workorders/${orderId}`, "delete");
      setWorkOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error("Error deleting work order:", error);
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

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Work Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WorkOrderForm
            formData={newOrder}
            setFormData={setNewOrder}
            onSubmit={handleCreateOrder}
            fieldErrors={fieldErrors}
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
            <span>Show Work Orders</span>
          </>
        )}
      </button>

      {showWorkOrderList && (
        <div className="mb-4">
          <WorkOrderList
            workOrders={workOrders}
            setSelectedOrder={setSelectedOrder}
          />
        </div>
      )}

      {selectedOrder && (
        <WorkOrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleUpdateOrder}
          onDelete={handleDeleteOrder}
        />
      )}
{events.length > 0 && (
  <div className="bg-primary-light text-black shadow-md rounded-lg overflow-hidden">
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      
      onSelectEvent={handleSelectEvent}
      eventPropGetter={eventPropGetter}
      selectable
      onSelectSlot={handleSelectSlot}
      views={["month", "week", "day"]}
      defaultView="month"
      onRangeChange={(range) => console.log("Visible Range:", range)} // Log the visible range
    />
  </div>
)}
    </div>
  );
};

export default CalendarView;
