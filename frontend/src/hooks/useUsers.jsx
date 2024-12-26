import { useEffect, useState } from "react";
import axios from "axios";

const useUsers = (token) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiCall = async (url, method = "get", data = {}) => {
    const response = await axios({
      method,
      url: `${import.meta.env.VITE_BACKEND_URL}${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
    return response.data;
  };

  const fetchUsers = async () => {
    try {
      const usersData = await apiCall("/api/users/roles");
      const filteredUsers = usersData.filter(
        (user) => user.role.name === "employee" || user.role.name === "manager"
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  return { users, loading, error };
};

export default useUsers;