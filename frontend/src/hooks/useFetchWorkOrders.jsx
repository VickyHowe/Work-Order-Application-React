import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const useFetchWorkOrders = (token, userRole) => {
    const [workOrders, setWorkOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWorkOrders = useCallback(async () => {
        setLoading(true);
        try {
            let url;
            if (userRole === 'admin' || userRole === 'manager') {

                url = `${import.meta.env.VITE_BACKEND_URL}/api/workorders`;
            } else {

                url = `${import.meta.env.VITE_BACKEND_URL}/api/workorders/user`;
            }

            const response = await axios.get(url, {
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
    }, [token, userRole]);

    useEffect(() => {
        fetchWorkOrders();
    }, [fetchWorkOrders]);

    return { workOrders, setWorkOrders, loading, error, fetchWorkOrders };
};

export default useFetchWorkOrders;