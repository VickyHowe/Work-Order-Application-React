import React from 'react';
import { Link } from 'react-router-dom';

const CustomerComponent = () => {
    return (
        <div>
            <h3>Customer Dashboard</h3>
            <p>Welcome to your dashboard!</p>
            <Link to="/pricelist">
                <button className="btn btn-primary">View Services</button>
            </Link>
            <Link to="/calendar">
                <button className="btn btn-info">View Calendar</button>
            </Link>
        </div>
    );
};

export default CustomerComponent;