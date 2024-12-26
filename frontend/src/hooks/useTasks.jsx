// src/hooks/useTasks.js
import { useEffect, useState } from "react";
import useApi from "./useApi"; // Import the custom hook for API calls

const useTasks = (token) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiCall } = useApi(); // Use the custom hook

  const fetchTasks = async () => {
    try {
      const tasksData = await apiCall("/api/tasks");
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await apiCall("/api/tasks", "post", taskData);
      setTasks((prevTasks) => [...prevTasks, response]);
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Error creating task");
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const response = await apiCall(`/api/tasks/${taskId}`, "put", taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? response : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Error updating task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await apiCall(`/api/tasks/${taskId}`, "delete");
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Error deleting task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, error, createTask, updateTask, deleteTask };
};

export default useTasks;