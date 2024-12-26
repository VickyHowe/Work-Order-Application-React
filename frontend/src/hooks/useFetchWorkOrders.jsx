import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const useFetchWorkOrders = (token) => {
    const [workOrders, setWorkOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch work orders wrapped in useCallback
    const fetchWorkOrders = useCallback(async () => {
        setLoading(true); // Set loading to true before fetching
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workorders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWorkOrders(response.data); // Update work orders state
        } catch (error) {
            setError("Error fetching work orders");
            console.error("Error fetching work orders:", error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    }, [token]); // Add token as a dependency

    // Fetch work orders when the token changes
    useEffect(() => {
        fetchWorkOrders(); // Call the fetch function on mount or when token changes
    }, [fetchWorkOrders]); // Include fetchWorkOrders in the dependency array

    // Return the fetch function so it can be called externally
    return { workOrders, setWorkOrders, loading, error, fetchWorkOrders };
};

export default useFetchWorkOrders;