import { useState, useEffect, useCallback } from 'react';
import useApi from './useApi';

const useFetchWorkOrders = (token, userRole, userId) => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiCall, loading: apiLoading, error: apiError } = useApi();

  const fetchWorkOrders = useCallback(async () => {
    setLoading(true);
    console.log('My Userrole:', userRole);
    try {
      let url;
      if (userRole === 'admin' || userRole === 'manager') {
        url = '/api/workorders';
      } else {
        url = `/api/workorders/user/${userId}`;
      }

      console.log('Fetching work orders from URL:', url);

      const response = await apiCall(url);
      setWorkOrders(response);
    } catch (error) {
      setError("Error fetching work orders");
      console.error("Error fetching work orders:", error);
    } finally {
      setLoading(false);
    }
  }, [apiCall, userRole, userId]);

  useEffect(() => {
    if (userId) {
      fetchWorkOrders();
    }
  }, [fetchWorkOrders, userId]);

  return { workOrders, setWorkOrders, loading: loading || apiLoading, error: error || apiError, fetchWorkOrders };
};

export default useFetchWorkOrders;