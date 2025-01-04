import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import WorkOrderForm from "../workOrders/WorkOrderForm";
import useApi from "../../hooks/useApi";
import useFetchWorkOrders from "../../hooks/useFetchWorkOrders";

const CustomerComponent = ({ userRole }) => {
  console.log("User  role in CustomerComponent:", userRole);

  const { apiCall } = useApi();
  const token = localStorage.getItem("token");

  const {
    workOrders,
    setWorkOrders,
    loadingWorkOrders,
    errorWorkOrders,
    fetchWorkOrders,
  } = useFetchWorkOrders(token, userRole);

  const [pricelists, setPricelists] = useState([]);
  const [loadingPricelists, setLoadingPricelists] = useState(true);
  const [errorPricelists, setErrorPricelists] = useState(null);

  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "",
    status: "",
    customerComments: "",
    predefinedServices: "",
    attachments: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // State for completed work orders visibility
  const [showCompleted, setShowCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of work orders per page
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // State for showing/hiding services and work orders
  const [showServices, setShowServices] = useState(false);
  const [showWorkOrders, setShowWorkOrders] = useState(false);

  // Fetch pricelists
  useEffect(() => {
    const fetchPricelists = async () => {
      setLoadingPricelists(true);
      try {
        const response = await apiCall("/api/pricelist", "get");
        setPricelists(response);
      } catch (error) {
        setErrorPricelists("Error fetching pricelists");
        console.error("Error fetching pricelists:", error);
      } finally {
        setLoadingPricelists(false);
      }
    };

    fetchPricelists();
  }, [apiCall]);

  const handleRequestService = (service) => {
    setSelectedService(service);
    setFormData({
      title: service.itemName,
      description: service.description,
      deadline: "",
      customerComments: "",
      predefinedServices: service.itemName,
      attachments: "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    // Basic validation
    const errors = {};
    if (!formData.title) errors.title = true;
    if (!formData.description) errors.description = true;
    if (!formData.deadline) errors.deadline = true;

    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
      setFieldErrors(errors);
      return;
    }

    try {
      // Call API to submit the work order request
      await apiCall("/api/workorders/request", "post", {
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        customerComments: formData.customerComments,
        predefinedServices: formData.predefinedServices
          .split(",")
          .map((service) => service.trim()),
        attachments: formData.attachments
          .split(",")
          .map((attachment) => attachment.trim()),
      });
      setShowSuccessModal(true);
      handleCloseModal();
      fetchWorkOrders(); // Fetch updated work orders after submission
    } catch (err) {
      console.error ("Error submitting request:", err);
      setFieldErrors({ ...fieldErrors, submit: "Error submitting request" });
    }
  };

  // Filter work orders based on search query
  const filteredWorkOrders = workOrders.filter(order => 
    order.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    order.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show/Hide completed work orders
  const displayedWorkOrders = showCompleted 
    ? filteredWorkOrders 
    : filteredWorkOrders.filter(order => order.status !== "completed");

  // Pagination logic
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = displayedWorkOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(displayedWorkOrders.length / itemsPerPage);

  return (
    <div>
      <h4>Book your service today!</h4>
      <p>All work will be scheduled upon equipment dropoff. Final billing will take place upon equipment pickup.</p>
      {errorPricelists && <p className="text-danger">{errorPricelists}</p>}
      {errorWorkOrders && <p className="text-danger">{errorWorkOrders}</p>}
      
      {/* Buttons to toggle services and work orders */}
      <div className="mb-3">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowServices(!showServices)}
        >
          {showServices ? "Hide Available Services" : "See Available Services"}
        </button>
        <button 
          className="btn btn-secondary ml-2" 
          onClick={() => setShowWorkOrders(!showWorkOrders)}
        >
          {showWorkOrders ? "Hide My Open Work Orders" : "See My Open Work Orders"}
        </button>
      </div>

      {/* Display available services */}
      {showServices && (
        <div className="row pt-2">
          {loadingPricelists ? (
            <p>Loading services...</p>
          ) : (
            pricelists.map((item) => (
              <div className="col-md-4" key={item._id}>
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">{item.itemName}</h5>
                    <p className="card-text">Price: ${item.price}</p>
                    <p className="card-text">{item.description}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleRequestService(item)}
                    >
                      Request Service
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Display open work orders */}
      {showWorkOrders && (
        <div>
          <h4>Your Work Orders</h4>
          <div className="mb-3">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="form-control"
            />
            <button 
              className="btn btn-secondary mt-2" 
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? <FaEyeSlash /> : <FaEye />} 
              {showCompleted ? " Hide Completed" : " Show Completed"}
            </button>
          </div>

          {loadingWorkOrders ? (
            <p>Loading work orders...</p>
          ) : displayedWorkOrders.length > 0 ? (
            <ul className="list-group">
              {currentOrders.map((order) => (
                <li className="list-group-item" key={order._id}>
                  <h5>{order.title}</h5>
                  <p>Status: {order.status}</p>
                  <p>Requested on: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>Customer Comments: {order.customerComments}</p>
                  <p>Requested Deadline: {new Date(order.deadline).toLocaleDateString()}</p>
                  <p>Assigned To: {order.assignedTo}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No work orders found.</p>
          )}

          {/* Pagination Controls */}
          <nav>
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <li className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} key={index}>
                  <button className ="page-link" onClick={() => setCurrentPage(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* WorkRequested Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalLabel"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalLabel">
                Request Service
              </h5>
              <button
                type="button"
                className="close"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <WorkOrderForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                fieldErrors={fieldErrors}
                userRole={userRole}
                onClose={handleCloseModal}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Success Modal */}
      <div
        className={`modal fade ${showSuccessModal ? "show" : ""}`}
        style={{ display: showSuccessModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="successModalLabel"
        aria-hidden={!showSuccessModal}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="successModalLabel">
                Success
              </h5>
              <button
                type="button"
                className="close"
                onClick={() => setShowSuccessModal(false)}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>
                Thank you for your service request. We start processing your
                request soon!
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerComponent;