import React from "react";

const WorkOrderList = ({ workOrders, setSelectedOrder }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-bold mb-2">Work Orders</h2>
      <ul>
        {workOrders.map((order) => (
          <li key={order._id} className="mb-2">
            <button
              className="text-blue-500"
              onClick={() => setSelectedOrder(order)} 
            >
              {order.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkOrderList;