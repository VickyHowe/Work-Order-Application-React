import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const useFetchWorkOrders = (token) => {
    const [workOrders, setWorkOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWorkOrders = useCallback(async () => {
        setLoading(true); 
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workorders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWorkOrders(response.data); 
        } catch (error) {
            setError("Error fetching work orders");
            console.error("Error fetching work orders:", error);
        } finally {
            setLoading(false);
        }
    }, [token]); 

    useEffect(() => {
        fetchWorkOrders();
    }, [fetchWorkOrders]); 

    return { workOrders, setWorkOrders, loading, error, fetchWorkOrders }; 
};

export default useFetchWorkOrders;