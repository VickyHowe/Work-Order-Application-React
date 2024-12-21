import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { FaSortUp, FaSortDown } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [roleChanges, setRoleChanges] = useState({}); // State to hold role changes
  const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user for details
  const [editUser, setEditUser] = useState(null); // State to hold the user being edited
  const [filter, setFilter] = useState(""); // State for filtering users
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "asc",
  }); // State for sorting configuration
  const [currentUser, setCurrentUser] = useState(null); // State to hold the current user
  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      try {
        // Fetch users
        const usersResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/roles`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the headers
            },
          }
        );

        // Filter out admin users for managers
        const filteredUsers = usersResponse.data.filter(
          (user) => user.role?.name !== "admin"
        );
        setUsers(filteredUsers);

        // Fetch all roles from the correct endpoint
        const rolesResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/roles`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the headers
            },
          }
        );
        setRoles(rolesResponse.data);

        // Fetch current user details
        const currentUserResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the headers
            },
          }
        );
        setCurrentUser(currentUserResponse.data); // Store current user details
      } catch (error) {
        console.error("Error fetching users or roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndRoles();
  }, []);
  const handleRoleChange = (userId, roleId) => {
    // Update the roleChanges state with the new roleId for the specific userId
    setRoleChanges((prev) => ({
      ...prev,
      [userId]: roleId,
    }));
  };

  const handleSubmitChanges = async () => {
    try {
      // Create an array of promises for all role updates
      const updatePromises = Object.entries(roleChanges).map(
        ([userId, roleId]) => {
          return axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/role`,
            { roleId },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the headers
              },
            }
          );
        }
      );

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      // Fetch the updated users list
      const usersResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/roles`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the headers
          },
        }
      );
      setUsers(usersResponse.data);
      setRoleChanges({}); // Clear the role changes after submission
      navigate("/dashboard");
    } catch (error) {
      console.error("Error assigning roles:", error);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user); // Set the selected user to view details
  };

  const handleCloseDetails = () => {
    setSelectedUser(null); // Clear the selected user
  };

  const handleEditUser = (user) => {
    setEditUser(user); // Set the user to be edited
  };

  const handleCloseEdit = () => {
    setEditUser(null); // Clear the edit user
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting user data:", editUser); // Debugging line to check the data being sent
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update/${editUser._id}`,
        editUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the headers
          },
        }
      );

      // Fetch the updated users list
      const usersResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/roles`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the headers
          },
        }
      );
      setUsers(usersResponse.data);
      setEditUser(null); // Clear the edit user after submission
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/delete/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the headers
            },
          }
        );

        // Fetch the updated users list after deletion
        const usersResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/roles`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the headers
            },
          }
        );
        setUsers(usersResponse.data); // Update the state with the new users list
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };
  // Function to filter users based on the filter state
  const filteredUsers = users.filter((user) => {
    const userName = user.username.toLowerCase();
    const userRole = user.role?.name.toLowerCase() || "";
    return (
      userName.includes(filter.toLowerCase()) ||
      userRole.includes(filter.toLowerCase())
    );
  });

  // Function to sort users based on the selected order
  const sortedUsers = filteredUsers.sort((a, b) => {
    const aValue =
      sortConfig.key === "username"
        ? a.username.toLowerCase()
        : a.role?.name.toLowerCase();
    const bValue =
      sortConfig.key === "username"
        ? b.username.toLowerCase()
        : b.role?.name.toLowerCase();

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="my-4">User Management</h2>

      {/* Filter and Sort Controls */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Filter by name or role"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover ">
          <thead>
            <tr>
              <th
                onClick={() => requestSort("username")}
                style={{ cursor: "pointer" }}
              >
                Username{" "}
                {sortConfig.key === "username" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSortUp />
                )}
              </th>
              <th
                onClick={() => requestSort("role")}
                style={{ cursor: "pointer" }}
              >
                Role{" "}
                {sortConfig.key === "role" ? (
                  sortConfig.direction === "asc" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSortUp />
                )}
              </th>
              <th>Assign Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role?.name || "No Role"}</td>
                <td>
                  {currentUser.role?.name === "admin" && ( // Admins can assign any role
                    <select
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      defaultValue={user.role?._id || ""}
                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      {roles.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {currentUser.role?.name === "manager" &&
                    user.role?.name !== "admin" &&
                    user.role?.name !== "manager" && ( // Managers can assign roles to users who are not managers or admins
                      <select
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        defaultValue={user.role?._id || ""}
                      >
                        <option value="" disabled>
                          Select Role
                        </option>
                        {roles
                          .filter(
                            (role) =>
                              role.name !== "manager" && role.name !== "admin"
                          ) // Exclude manager and admin roles for managers
                          .map((role) => (
                            <option key={role._id} value={role._id}>
                              {role.name}
                            </option>
                          ))}
                      </select>
                    )}
                </td>
                <td>
                  <Button
                    onClick={() => handleViewDetails(user)}
                    className="btn btn-info"
                  >
                    View Details
                  </Button>
                  {currentUser._id !== user._id && ( // Check if the user is not the current user
                    <>
                      {currentUser.role?.name === "admin" && ( // Only show edit and delete buttons for admins
                        <>
                          <Button
                            onClick={() => handleEditUser(user)}
                            className="btn btn-warning ml-2"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteUser(user._id)}
                            className="btn btn-danger ml-2"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                      {currentUser.role?.name === "manager" &&
                        user.role?.name !== "manager" &&
                        user.role?.name !== "admin" && ( // Managers can edit users who are not managers or admins
                          <Button
                            onClick={() => handleEditUser(user)}
                            className="btn btn-warning ml-2"
                          >
                            Edit
                          </Button>
                        )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button onClick={handleSubmitChanges} className="btn btn-primary mt-4">
        Submit Changes
      </Button>

      {/* Modal for viewing user details */}
      <Modal show={!!selectedUser } onHide={handleCloseDetails}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Username:</strong> {selectedUser ?.username}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser ?.email}
          </p>
          <p>
            <strong>Role:</strong> {selectedUser ?.role?.name || "No Role"}
          </p>
          <p>
            <strong>First Name:</strong> {selectedUser ?.profileDetails.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {selectedUser ?.profileDetails.lastName}
          </p>
          <p>
            <strong>Phone Number:</strong> {selectedUser ?.profileDetails.phoneNumber}
          </p>
          <p>
            <strong>Address:</strong> {selectedUser ?.profileDetails.address}
          </p>
          <p>
            <strong>City:</strong> {selectedUser ?.profileDetails.city}
          </p>
          <p>
            <strong>Province:</strong> {selectedUser ?.profileDetails.province}
          </p>
          <p>
            <strong>Postal Code:</strong> {selectedUser  ?.profileDetails.postalCode}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

 {/* Modal for editing user details */}
<Modal show={!!editUser } onHide={handleCloseEdit}>
  <Modal.Header closeButton>
    <Modal.Title>Edit User Details</Modal.Title>
  </Modal.Header>
  <form onSubmit={handleEditSubmit}>
    <Modal.Body>
      {editUser  && ( // Check if editUser  is not null
        <>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={editUser .username || ""}
              onChange={(e) =>
                setEditUser ({ ...editUser , username: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={editUser .email || ""}
              onChange={(e) =>
                setEditUser ({ ...editUser , email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              value={editUser .profileDetails?.firstName || ""}
              onChange={(e) =>
                setEditUser ({
                  ...editUser ,
                  profileDetails: {
                    ...editUser .profileDetails,
                    firstName: e.target.value,
                  },
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              value={editUser .profileDetails?.lastName || ""}
              onChange={(e) =>
                setEditUser ({
                  ...editUser ,
                  profileDetails: {
                    ...editUser .profileDetails,
                    lastName: e.target.value,
                  },
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              className="form-control"
              value={editUser .profileDetails?.phoneNumber || ""}
              onChange={(e) =>
                setEditUser ({
                  ...editUser ,
                  profileDetails: {
                    ...editUser .profileDetails,
                    phoneNumber: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              className="form-control"
              value={editUser .profileDetails?.address || ""}
              onChange={(e) =>
                setEditUser ({
                  ...editUser ,
                  profileDetails: {
                    ...editUser .profileDetails,
                    address: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              className="form-control"
              value={editUser .profileDetails?.city || ""}
              onChange={(e) =>
                setEditUser ({
                  ...editUser ,
                  profileDetails: {
                    ...editUser .profileDetails,
                    city: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Province</label>
            <input
              type="text"
              className="form-control"
              value={editUser .profileDetails?.province || ""}
              onChange={(e) =>
                setEditUser ({
                  ...editUser ,
                  profileDetails: {
                    ...editUser .profileDetails,
                    province: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              className="form-control"
              value={editUser .profileDetails?.postalCode || ""}
              onChange={(e) =>
                setEditUser ({
                  ...editUser ,
                  profileDetails: {
                    ...editUser .profileDetails,
                    postalCode: e.target.value,
                  },
                })
              }
            />
          </div>
        </>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseEdit}>
        Cancel
      </Button>
      <Button type="submit" variant="primary">
        Save Changes
      </Button>
    </Modal.Footer>
  </form>
</Modal>
    </div>
  );
};

export default UserManagement;
