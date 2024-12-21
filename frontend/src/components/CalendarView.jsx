import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import WorkOrderList from './WorkOrderList'; // Import the WorkOrderList component

const localizer = momentLocalizer(moment);

const CalendarView = ({ user }) => {
    const [events, setEvents] = useState([]);
    const [showWorkOrderList, setShowWorkOrderList] = useState(false); // State to toggle work order list

    useEffect(() => {
        const fetchWorkOrders = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workorders`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const workOrders = response.data.map(order => ({
                    id: order._id,
                    title: order.title,
                    start: new Date(order.deadline),
                    end: new Date(order.deadline),
                    allDay: true,
                }));
                setEvents(workOrders);
            } catch (error) {
                console.error('Error fetching work orders:', error);
            }
        };

        fetchWorkOrders();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl mb-4">Work Orders Calendar</h2>
            <button
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setShowWorkOrderList(!showWorkOrderList)} // Toggle the work order list
            >
                {showWorkOrderList ? 'Hide Work Orders' : 'Show Work Orders'}
            </button>
            {showWorkOrderList && <WorkOrderList user={user} />} {/* Conditionally render the WorkOrderList */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                />
            </div>
        </div>
    );
};

export default CalendarView;