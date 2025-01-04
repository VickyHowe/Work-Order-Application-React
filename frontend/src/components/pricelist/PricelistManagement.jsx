import { useState, useEffect } from "react";
import useApi from "../../hooks/useApi"; // Import the useApi hook

const PricelistManagement = ({ user }) => {
  const role = user && user.role;
  console.log("User Role in PriceListManagement", role);

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [pricelists, setPricelists] = useState([]);
  const [loadingPricelists, setLoadingPricelists] = useState(false);
  const [errorPricelists, setErrorPricelists] = useState("");
  const [editingService, setEditingService] = useState(null);
  const { apiCall, loading } = useApi(); // Use the useApi hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state before making the API call

    try {
      if (editingService) {
        await apiCall(`/api/pricelist/${editingService._id}`, "put", {
          itemName,
          price,
          description,
        });
        setEditingService(null);
        // Close the modal after updating
        document.getElementById("editServiceModal").classList.remove("show");
        document.getElementById("editServiceModal").style.display = "none";
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "auto";
      } else {
        await apiCall("/api/pricelist", "post", {
          itemName,
          price,
          description,
        });
      }
      // Clear the form fields after successful submission
      setItemName("");
      setPrice("");
      setDescription("");
      fetchPricelists();
    } catch (err) {
      setError("Error creating pricelist item");
    }
  };

  const fetchPricelists = async () => {
    setLoadingPricelists(true);
    setErrorPricelists("");
    try {
      const response = await apiCall("/api/pricelist", "get");
      setPricelists(response);
    } catch (err) {
      setErrorPricelists("Error fetching pricelists");
    } finally {
      setLoadingPricelists(false);
    }
  };

  useEffect(() => {
    fetchPricelists();
  }, []);

  // Check if the user has permission to create pricelists
  const canCreatePricelist = role && (role === "admin" || role === "manager");

  const handleEditService = (service) => {
    setEditingService(service);
    setItemName(service.itemName);
    setPrice(service.price);
    setDescription(service.description);
  };

  const handleDeleteService = async (id) => {
    try {
      await apiCall(`/api/pricelist/${id}`, "delete");
      fetchPricelists();
    } catch (err) {
      setError("Error deleting pricelist item");
    }
  };

  return (
    <div>
      <h2>Manage Services</h2>
      {error && <p className="text-red-500">{error}</p>}
      {canCreatePricelist ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {editingService ? "Save Changes" : "Add to Pricelist"}
          </button>
        </form>
      ) : (
        <p>You do not have permission to create new pricelist items.</p>
      )}
      {/* Display available services */}
      <div className="row pt-2">
        <h2>Available Services</h2>
        {loadingPricelists ? (
          <p>Loading services...</p>
        ) : errorPricelists ? (
          <p className="text-danger">{errorPricelists}</p>
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
                    data-bs-toggle="modal"
                    data-bs-target="#editServiceModal"
                    onClick={() => handleEditService(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteService(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Edit Service Modal */}
      <div
        className="modal fade"
        id="editServiceModal"
        tabIndex="-1"
        aria-labelledby="editServiceModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editServiceModalLabel">
                Edit Service
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Item Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricelistManagement;
