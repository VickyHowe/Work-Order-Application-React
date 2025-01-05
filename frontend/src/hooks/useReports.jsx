import React from 'react';
import useApi from './useApi';

const useReports = () => {
  const { apiCall, loading, error } = useApi();
  const [reportData, setReportData] = React.useState(null);

  React.useEffect(() => {
    const fetchReportData = async () => {
      try {
        const data = await apiCall('/api/reports');
        setReportData(data);
      } catch (err) {
        console.error("Failed to fetch report data:", err);
      }
    };

    fetchReportData();
  }, [apiCall]);

  // Provide default values for reportData
  const defaultReportData = {
    totalWorkOrders: 0,
    completedWorkOrders: 0,
    pendingTasks: 0,
    workOrdersByStatus: { pending: 0, inProgress: 0, completed: 0 },
    workOrdersByPriority: { low: 0, medium: 0, high: 0 },
    tasksByStatus: { pending: 0, inProgress: 0, completed: 0 },
    averageTimeToComplete: 0,
    averageTimeToCompleteTasks: 0,
    onTimeCompletionMetrics: {
      tasks: [], 
      workOrders: [] 
    }
  };

// Use default values if reportData is undefined
const safeReportData = reportData ? { ...defaultReportData, ...reportData } : defaultReportData;

  // Prepare data for multiple D3 charts
  const chartData = {
    workOrdersOverview: [
      { name: "Total Work Orders", value: safeReportData.totalWorkOrders },
      { name: "Completed Work Orders", value: safeReportData.completedWorkOrders },
      { name: "Pending Tasks", value: safeReportData.pendingTasks },
    ],
    workOrdersByStatus: Object.entries(safeReportData.workOrdersByStatus).map(([status, value]) => ({
      name: status,
      value,
    })),
    workOrdersByPriority: Object.entries(safeReportData.workOrdersByPriority).map(([priority, value]) => ({
      name: priority,
      value,
    })),
    tasksByStatus: Object.entries(safeReportData.tasksByStatus).map(([status, value]) => ({
      name: status,
      value,
    })),
    tasksOnTime: safeReportData.onTimeCompletionMetrics.tasks.map((entry) => ({
      date: entry.date,
      value: entry.percentage,
    })),
    workOrdersOnTime: safeReportData.onTimeCompletionMetrics.workOrders.map((entry) => ({
      date: entry.date,
      value: entry.percentage,
    })),
    // Percentages and averages
    completionPercentages: [
      { name: "Work Orders", value: (safeReportData.completedWorkOrders / safeReportData.totalWorkOrders) * 100 || 0 },
      { name: "Tasks", value: (safeReportData.tasksByStatus.completed / (safeReportData.tasksByStatus.pending + safeReportData.tasksByStatus.completed)) * 100 || 0 },
    ],
    averageTimes: [
      { name: "Work Orders", value: safeReportData.averageTimeToComplete },
      { name: "Tasks", value: safeReportData.averageTimeToCompleteTasks },
    ],
  };

  return { chartData, loading, error };
};

export default useReports;