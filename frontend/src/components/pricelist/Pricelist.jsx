import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";

const Pricelist = ({ user }) => {
  const { apiCall } = useApi();
  const [pricelists, setPricelists] = useState([]);
  const [loadingPricelists, setLoadingPricelists] = useState(true);
  const [errorPricelists, setErrorPricelists] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPricelists = async () => {
      setLoadingPricelists(true);
      try {
        const response = await apiCall("/api/pricelist", "get", {
          headers: {
            Authorization: user ? `Bearer ${localStorage.getItem("token")}` : undefined,
          },
        });
        setPricelists(response);
      } catch (error) {
        setErrorPricelists("Error fetching pricelists");
        console.error("Error fetching pricelists:", error.response ? error.response.data : error);
      } finally {
        setLoadingPricelists(false);
      }
    };

    fetchPricelists();
  }, [apiCall, user]);

  const handleRequestService = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <h4>Book your service today!</h4>
      <div>
        <button className="btn btn-primary" onClick={handleRequestService}>
          Request Service
        </button>
      </div>
      <p>
        All work will be scheduled upon equipment dropoff. Final billing will
        take place upon equipment pickup.
      </p>
      {/* Display available services */}
      <div className="row pt-2">
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
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Pricelist;