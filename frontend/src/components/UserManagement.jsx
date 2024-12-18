import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:5000/api/users'); // Adjust the URL as needed
        const rolesResponse = await axios.get('http://localhost:5000/api/roles'); // Adjust the URL as needed
        setUsers(usersResponse.data);
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error('Error fetching users or roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndRoles();
  }, []);

  const handleRoleChange = async (userId, roleId) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}/role`, { roleId }); // Adjust the URL as needed
      // Optionally, refresh the user list or update the state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: roleId } : user
        )
      );
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Management</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Assign Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role?.name || 'No Role'}</td>
              <td>
                <select
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  defaultValue={user.role?._id || ''}
                >
                  <option value="" disabled>Select Role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;