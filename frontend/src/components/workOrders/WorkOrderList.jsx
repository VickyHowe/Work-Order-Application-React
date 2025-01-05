  import React, { useState, useEffect } from 'react';
  import { Modal } from 'react-bootstrap';
  import { FaSort, FaSortUp, FaSortDown, FaEye, FaEdit, FaTrash, FaUserTimes, FaCheckCircle, FaSpinner, FaHourglassHalf } from 'react-icons/fa';
  import useFetchWorkOrders from '../../hooks/useFetchWorkOrders';
  import WorkOrderForm from './WorkOrderForm';
  import WorkOrderDetails from './WorkOrderDetails';
  import useApi from '../../hooks/useApi';
  
  const WorkOrderList = ({ user }) => {
  
    const token = localStorage.getItem("token");
    const userId = user.id;
  
    const userRole = user.role;
    const { workOrders, setWorkOrders, loading, error, fetchWorkOrders } = useFetchWorkOrders(token, userRole, userId);
    const { apiCall } = useApi();
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [assignedToValue, setAssignedToValue] = useState("");
    
  
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [sortConfig, setSortConfig] = useState({
      key: "title",
      direction: "ascending",
    });
  
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      deadline: "",
      status: "pending",
      priority: "medium",
      assignedTo: "",
    });
  
    const [fieldErrors, setFieldErrors] = useState({
      title: false,
      description: false,
      deadline: false,
    });
  
    const [users, setUsers] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
  
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
    }, [apiCall]);
  
    useEffect(() => {
      fetchWorkOrders(); 
    }, [fetchWorkOrders]);
  
    const openEditModal = (order) => {
      setSelectedOrder(order);
      setFormData({
        title: order.title,
        description: order.description,
        deadline: order.deadline,
        status: order.status,
        priority: order.priority,
        assignedTo: order.user ? order.user._id : "",
      });
      setAssignedToValue(order.user ? order.user._id : "");
      setShowModal(true);
    };
  
    const handleEditOrder = async (formValues) => {
      console.log("Form values when submitting edit order:", formValues);
      const errors = {
        title: !formValues.title,
        description: !formValues.description,
        deadline: !formValues.deadline,
      };
    
      setFieldErrors(errors);
    
      if (Object.values(errors).some((error) => error)) {
        setErrorMessage("Please fill in all fields.");
        return;
      }
      setErrorMessage("");
      try {
        console.log("Form data being sent:", formValues);
        const response = await apiCall(`/api/workorders/${selectedOrder._id}`, "put", {
          title: formValues.title,
          description: formValues.description,
          deadline: formValues.deadline,
          status: formValues.status,
          priority: formValues.priority,
          assignedTo: formValues.assignedTo,
        });
        console.log("API Response:", response);
        console.log("Work order object:", response.workOrder);
        console.log("Work order updated successfully!");
        setShowModal(false);
        setFormData({
          title: "",
          description: "",
          deadline: "",
          status: "pending",
          priority: "medium",
          assignedTo: "",
        });
        const updatedWorkOrders = workOrders.map((order) => {
          if (order._id === selectedOrder._id) {
            return response.workOrder;
          }
          return order;
        });
        setWorkOrders(updatedWorkOrders);
      } catch (error) {
        console.error("Error updating order:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      }
    };

    const handleCreateOrder = async () => {
      console.log('Creating new order...');
      setSelectedOrder(null);
      const errors = {
        title: !formData.title,
        description: !formData.description,
        deadline: !formData.deadline,
      };
    
      setFieldErrors(errors);
    
      if (Object.values(errors). some((error) => error)) {
        setErrorMessage("Please fill in all fields.");
        return;
      }
      setErrorMessage("");
      try {
        console.log("Form data being sent:", formData);
        const response = await apiCall("/api/workorders/request", "post", {
          title: formData.title,
          description: formData.description,
          deadline: formData.deadline,
          status: formData.status,
          priority: formData.priority,
          assignedTo: assignedToValue,
        });
        console.log('Response from API:', response);
        console.log("Work order created successfully!");
        setShowModal(false);
        setFormData({
          title: "",
          description: "",
          deadline: "",
          status: "pending",
          priority: "medium",
          assignedTo: "",
        });
        fetchWorkOrders();
      } catch (error) {
        console.error("Error creating order:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      }
    };
  
    const openDetailsModal = (order) => {
      setSelectedOrder(order);
      setShowDetailsModal(true);
    };
  
    const handleSort = (key) => {
      let direction = "ascending";
      if (sortConfig.key === key && sortConfig.direction === "ascending") {
        direction = "descending";
      }
      setSortConfig({ key, direction });
    };
  
    const sortedOrders = [...workOrders].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  
    const filteredOrders = sortedOrders.filter(
      (order) =>
        order.title.toLowerCase().includes(search.toLowerCase()) &&
        (showCompleted || order.status !== "completed")
    );
  
    const handleDeleteOrder = async (orderId) => {
      if (window.confirm("Are you sure you want to delete this work order?")) {
        try {
          await apiCall(`/api/workorders/${orderId}`, "delete");
          setWorkOrders(workOrders.filter(order => order._id !== orderId));
        } catch (error) {
          console.error("Error deleting order:", error);
        }
      }
    };
  
    return (
      <div className="mx-auto mt-10 p-6 bg-forms text-black border-gray rounded-lg shadow-md w-full sm:max-w-md md:max-w-lg lg:max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Work Orders</h2>
        <button onClick={() => setShowModal(true)} className="bg-green-500 text-white p-2 rounded mb-4">
          Add Work Order
        </button>
        {loading && <p>Loading work orders...</p>}
        {error && <p>{error}</p>}
        <input
          type="text"
          placeholder="Search work orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 mb-4 w-full rounded-md"
        />
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={() => setShowCompleted(!showCompleted)}
            className="mr-2"
          />
          Show Completed Orders
        </label>
  
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("title")}>
                Title {sortConfig.key === "title" ? (sortConfig.direction === "ascending" ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
              </th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("description")}>
                Description {sortConfig.key === "description" ? (sortConfig.direction === "ascending" ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
              </th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("deadline")}>
                Deadline {sortConfig.key === "deadline" ? (sortConfig.direction === "ascending" ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
              </th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("status")}>
                Status {sortConfig.key === "status" ? (sortConfig.direction === "ascending" ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
              </th>
              <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("assignedTo")}>
                Assigned To {sortConfig.key === "assignedTo" ? (sortConfig.direction === "ascending" ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
              </th>
              <th className="py-2 px-4 border-b cursor-pointer">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{order.title}</td>
                <td className="py-2 px-4 border-b">{order.description}</td>
                <td className="py-2 px-4 border-b">{new Date(order.deadline).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">
                  {order.status === "completed" ? (
                    <span className="flex items-center text-green-500">
                      <FaCheckCircle className="mr-1" /> Completed
                    </span>
                  ) : order.status === "in-progress" ? (
                    <span className="flex items-center text-yellow-500">
                      <FaSpinner className="mr-1 animate-spin" /> In Progress
                    </span>
                  ) : (
                    <span className="flex items-center text-gray-500">
                      <FaHourglassHalf className="mr-1" /> Pending
                    </span>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
  {order.assignedTo && order.assignedTo._id ? (
    users.find((user) => user._id === order.assignedTo._id)?.username
  ) : (
    <span className="flex items-center">
      <FaUserTimes className="mr-1" /> Unassigned
    </span>
  )}
</td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => { openDetailsModal(order); }} className="bg-blue-500 text-white p-2 rounded mr-2">
                    <FaEye /> Details
                  </button>
                  <button onClick={() => { openEditModal(order); }} className="bg-yellow-500 text-white p-2 rounded mr-2">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDeleteOrder(order._id)} className="bg-red-500 text-white p-2 rounded">
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {/* Work Order Form Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedOrder ? "Edit Work Order" : "Create New Work Order"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
  <WorkOrderForm 
    formData={formData} 
    setFormData={setFormData} 
    onSubmit={selectedOrder ? handleEditOrder : handleCreateOrder} 
    users={users} 
    userRole={userRole} 
    fieldErrors={fieldErrors} 
    onClose={() => setShowModal(false)} 
  />
</Modal.Body>
        </Modal>
  
        {/* Work Order Details Modal */}
        <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Work Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <WorkOrderDetails order={selectedOrder} onClose={() => setShowDetailsModal(false)} />
          </Modal.Body>
        </Modal>
      </div>
    );
  };
  
  export default WorkOrderList;