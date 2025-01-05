import { useState, useEffect } from "react";
import useApi from "./useApi";

const useUsers = (token) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiCall } = useApi();

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