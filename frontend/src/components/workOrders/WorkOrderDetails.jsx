import WorkOrderDetails from "../workOrders/WorkOrderDetails";

const CalendarView = ({ user }) => {
  const token = localStorage.getItem("token");
  const { workOrders, fetchWorkOrders } = useFetchWorkOrders(token);
  const [showWorkOrderList, setShowWorkOrderList] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleUpdateOrder = async (updatedOrder) => {
    try {
      const response = await apiCall(`/api/workorders/${updatedOrder._id}`, "put", updatedOrder);
      setWorkOrders((prevOrders) => 
        prevOrders.map((order) => (order._id === updatedOrder._id ? response : order))
      );
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating work order:", error);
    }
  };

  return (
    <div className="p-4">
      {/* Existing code for creating and showing work orders */}
      {showWorkOrderList && (
        <div className="mb-4">
          <WorkOrderList
            user={user}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            fetchWorkOrders={fetchWorkOrders}
          />
        </div>
      )}
      {selectedOrder && (
        <WorkOrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleUpdateOrder}
        />
      )}
      <div className="bg-primary-light text-black shadow-md rounded-lg overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </div>
  );
};

export default CalendarView;