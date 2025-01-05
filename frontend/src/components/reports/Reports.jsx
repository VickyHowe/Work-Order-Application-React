import React from 'react';
import useReports from '../../hooks/useReports';
import D3Chart from '../reports/D3Chart';
import MetricCard from '../reports/MetricCard';

const ReportsPage = () => {
  const { chartData, loading, error } = useReports();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mx-auto mt-10 p-6 bg-forms text-black border-gray rounded-lg shadow-md w-full sm:max-w-md md:max-w-lg lg:max-w-4xl">
      <h1 className="text-2xl text-center font-bold mb-4">Reports</h1>
      <div className="space-y-8 w-full">
        
        {/* Work Orders Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary-light p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Work Orders Overview</h2>
            <div className="bg-white p-4 rounded-lg"> 
              <D3Chart data={chartData.workOrdersOverview} title="Work Orders Overview" />
            </div>
          </div>
          <MetricCard
            title="Work Orders Overview"
            values={chartData.workOrdersOverview} 
            description="Overview of work orders."
          />
        </div>

        {/* Work Orders by Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary-light p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Work Orders by Status</h2>
            <div className="bg-white p-4 rounded-lg"> 
              <D3Chart data={chartData.workOrdersByStatus} title="Work Orders by Status" />
            </div>
          </div>
          <MetricCard
            title="Work Orders by Status"
            values={chartData.workOrdersByStatus} 
            description="Breakdown of work orders by status."
          />
        </div>

        {/* Work Orders by Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary-light p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Work Orders by Priority</h2>
            <div className="bg-white p-4 rounded-lg"> 
              <D3Chart data={chartData.workOrdersByPriority} title="Work Orders by Priority" />
            </div>
          </div>
          <MetricCard
            title="Work Orders by Priority"
            values={chartData.workOrdersByPriority}
            description="Breakdown of work orders by priority."
          />
        </div>

        {/* Tasks by Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary-light p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Tasks by Status</h2>
            <div className="bg-white p-4 rounded-lg"> 
              <D3Chart data={chartData.tasksByStatus} title="Tasks by Status" />
            </div>
          </div>
          <MetricCard
            title="Tasks by Status"
            values={chartData.tasksByStatus} 
            description="Breakdown of tasks by status."
          />
        </div>

        {/* Completion Percentages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary-light p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Completion Percentages</h2>
            <div className="bg-white p-4 rounded-lg"> 
              <D3Chart data={chartData.completionPercentages} title="Completion Percentages" type="line" />
            </div>
          </div>
          <MetricCard
            title="Completion Percentages"
            values={chartData.completionPercentages}
            description="Percentage of work orders and tasks completed."
          />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;