import React from "react";

const MetricCard = ({ title, values = [], description }) => {
  return (
    <div className="bg-primary-light p-6 rounded-lg shadow-lg ">
                <h1 className="text-lg font-semibold pb-3">Summary</h1>
      <div className="bg-white text-black p-6 rounded-lg shadow-lg">
        <div className="text-2xl font-bold text-customText">
          {values.length > 0 ? (
            values.map((item, index) => (
              <div key={index}>
                {item.name}: {item.value}
              </div>
            ))
          ) : (
            <div>No data available</div>
          )}
        </div>
        {description && (
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
