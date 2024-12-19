import React, { useState } from 'react';
import axios from 'axios';

const PricelistManagement = () => {
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/pricelist`, {
                itemName,
                price,
                description,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // Handle success (e.g., show a success message or reset form)
        } catch (err) {
            setError('Error creating pricelist item');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
            <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <button type="submit">Add to Pricelist</button>
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
};

export default PricelistManagement;