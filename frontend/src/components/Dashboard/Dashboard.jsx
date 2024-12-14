import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataList from '../DataList/DataList'; 
import { useAuth } from '../Auth/AuthContext'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the user from AuthContext
  const [notifications, setNotifications] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [workOrderHistories, setWorkOrderHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token'); // Get the token from localStorage
    try {
      const [notificationsRes, schedulesRes, userProfilesRes, workOrderHistoriesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers
        }),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/schedules`, {
          headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers
        }),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userprofiles`, {
          headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers
        }),
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/workorderhistories`, {
          headers: { Authorization: `Bearer ${token}` }, // Include the token in the headers
        }),
      ]);
  
      // Check if any of the responses are not ok
      if (!notificationsRes.ok || !schedulesRes.ok || !userProfilesRes.ok || !workOrderHistoriesRes.ok) {
        throw new Error('Failed to fetch data');
      }
  
      // Parse the JSON data from each response
      const notificationsData = await notificationsRes.json();
      const schedulesData = await schedulesRes.json();
      const userProfilesData = await userProfilesRes.json();
      const workOrderHistoriesData = await workOrderHistoriesRes.json();
  
      // Log the fetched data
      console.log('Fetched data:', {
        notificationsData,
        schedulesData,
        userProfilesData,
        workOrderHistoriesData,
      });
  
      // Update state with the fetched data
      setNotifications(notificationsData);
      setSchedules(schedulesData);
      setUserProfiles(userProfilesData);
      setWorkOrderHistories(workOrderHistoriesData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log('User  in Dashboard:', user); // Debugging line
    if (!user) {
      handleLoginRedirect(); // Redirect to login if not logged in
    } else {
      fetchData(); // Fetch data if logged in
    }
  }, [user]);

  // Loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <DataList 
        title="Notifications" 
        data={notifications} 
        renderItem={(item) => <li key={item.id}>{item.message}</li>} 
      />
      <DataList 
        title="Schedules" 
        data={schedules} 
        renderItem={(item) => <li key={item.id}>{item.title}</li>} 
      />
      <DataList 
        title="User Profiles" 
        data={userProfiles} 
        renderItem={(item) => <li key={item.id}>{item.firstName} {item.lastName}</li>} 
      />
      <DataList 
        title="Work Order Histories" 
        data={workOrderHistories} 
        renderItem={(item) => <li key={item.id}>{item.description}</li>} 
      />
      <button onClick={handleLoginRedirect}>Go to Login</button>
    </div>
  );
};

export default Dashboard;