import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const useFetchPricelists = (token) => {
    const [pricelists, setPricelists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPricelists = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/pricelist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPricelists(response.data);
        } catch (error) {
            setError("Error fetching pricelists");
            console.error("Error fetching pricelists:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPricelists();
    }, [fetchPricelists]);

    return { pricelists, loading, error };
};

export default useFetchPricelists;