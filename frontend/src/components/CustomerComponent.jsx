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
            {/* Add more customer-specific functionality here */}
        </div>
    );
};

export default CustomerComponent;