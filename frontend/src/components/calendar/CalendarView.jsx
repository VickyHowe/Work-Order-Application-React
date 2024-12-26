import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import WorkOrderList from '../workOrders/WorkOrderList'; // Import the WorkOrderList component
import useFetchWorkOrders from '../../hooks/useFetchWorkOrders'; // Import the custom hook
import PropTypes from 'prop-types';

const localizer = momentLocalizer(moment);

const CalendarView = ({ user }) => {
    const token = localStorage.getItem('token');
    const { workOrders, fetchWorkOrders } = useFetchWorkOrders(token);
    const [showWorkOrderList, setShowWorkOrderList] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    CalendarView.propTypes = {
        user: PropTypes.object.isRequired, // Validate that user is an object and is required
    };
    // Create events from workOrders
    const events = workOrders.map(order => ({
        _id: order._id,
        title: order.title,
        start: new Date(order.deadline),
        end: new Date(order.deadline),
        allDay: true,
    }));

    const handleSelectEvent = (event) => {
        const order = events.find(e => e._id === event._id); // Use _id instead of id
        if (order) {
            console.log("Selected Order from Calendar:", order);
            setSelectedOrder(order);
            setShowWorkOrderList(true);
        } else {
            console.log("No order found for the selected event.");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl mb-4">Work Orders Calendar</h2>
            <button
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setShowWorkOrderList(!showWorkOrderList)}
            >
                {showWorkOrderList ? 'Hide Work Orders' : 'Show Work Orders'}
            </button>
            {showWorkOrderList && (
                <WorkOrderList 
                    user={user} 
                    selectedOrder={selectedOrder} 
                    setSelectedOrder={setSelectedOrder} 
                    fetchWorkOrders={fetchWorkOrders} // Pass fetchWorkOrders to WorkOrderList
                />
            )}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Calendar
                    localizer={localizer}
                    events={events} // Use the events derived from workOrders
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