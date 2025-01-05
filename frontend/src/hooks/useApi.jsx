import { useCallback, useState } from "react";
import axios from "axios";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (url, method = "get", data = {}) => {
    console.log("Calling API....")
    setLoading(true);
    setError(null);

    try {
      const fullUrl = `${import.meta.env.VITE_BACKEND_URL}${url}`;
      const token = localStorage.getItem("token");

      console.log("API URL:", fullUrl); // Debugging
      console.log("Token:", token); // Debugging

      const response = await axios({
        method,
        url: fullUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data,
      });

      console.log("API Response:", response.data); // Debugging
      return response.data;
    } catch (err) {
      console.error("API Error:", err); // Debugging
      setError(err.response?.data?.message || err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { apiCall, loading, error };
};

export default useApi;