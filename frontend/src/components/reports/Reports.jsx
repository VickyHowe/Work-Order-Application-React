import React from 'react';
import useReports from '../../hooks/useReports';
import D3Chart from '../reports/D3Chart';
import MetricCard from '../reports/MetricCard';

const ReportsPage = () => {
  const { chartData, loading, error } = useReports();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="space-y-8 w-full max-w-4xl">
        {/* Work Orders Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Work Orders Overview</h2>
            <D3Chart data={chartData.workOrdersOverview} title="Work Orders Overview" />
          </div>
          <MetricCard
            title="Total Work Orders"
            value={chartData.workOrdersOverview[0].value}
            description="Total number of work orders created."
          />
        </div>

        {/* Work Orders by Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Work Orders by Status</h2>
            <D3Chart data={chartData.workOrdersByStatus} title="Work Orders by Status" />
          </div>
          <MetricCard
            title="Completed Work Orders"
            value={chartData.completedWorkOrders}
            description="Number of work orders completed."
          />
        </div>

        {/* Work Orders by Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Work Orders by Priority</h2>
            <D3Chart data={chartData.workOrdersByPriority} title="Work Orders by Priority" />
          </div>
          <MetricCard
            title="High Priority Work Orders"
            value={chartData.workOrdersByPriority.find((d) => d.name === 'high')?.value || 0}
            description="Number of high priority work orders."
          />
        </div>

        {/* Tasks by Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Tasks by Status</h2>
            <D3Chart data={chartData.tasksByStatus} title="Tasks by Status" />
          </div>
          <MetricCard
            title="Pending Tasks"
            value={chartData.tasksByStatus.find((d) => d.name === 'pending')?.value || 0}
            description="Number of tasks pending completion."
          />
        </div>

        {/* Completion Percentages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Completion Percentages</h2>
            <D3Chart data={chartData.completionPercentages} title="Completion Percentages" type="line" />
          </div>
          <MetricCard
            title="Work Orders Completion Percentage"
            value={`${chartData.completedWorkOrdersPercentage}%`}
            description="Percentage of work orders completed."
          />
          
          <MetricCard
            title="Tasks Completion Percentage"
            value={`${chartData.completedTasksPercentage}%`}
            description="Percentage of tasks completed."
          />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;