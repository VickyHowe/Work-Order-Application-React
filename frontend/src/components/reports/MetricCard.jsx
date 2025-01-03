import React from 'react';

const MetricCard = ({ title, value, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">Summary</h2>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
      {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
    </div>
  );
};

export default MetricCard;