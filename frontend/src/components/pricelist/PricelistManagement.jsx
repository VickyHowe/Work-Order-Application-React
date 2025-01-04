import { useState } from 'react';
import axios from 'axios';

const PricelistManagement = ({ user }) => {
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/pricelist`, {
                itemName,
                price,
                description,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setItemName('');
            setPrice('');
            setDescription('');
        } catch {
            setError('Error creating pricelist item');
        }
    };

    // Check if the user has permission to create pricelists
    const canCreatePricelist = user && (user.role === 'admin' || user.role === 'manager');

    return (
        <div>
            <h2>Manage Pricelist</h2>
            {error && <p className="text-red-500">{error}</p>}
            {canCreatePricelist ? (
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
                    <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <button type="submit">Add to Pricelist</button>
                </form>
            ) : (
                <p>You do not have permission to create new pricelist items.</p>
            )}
        </div>
    );
};

export default PricelistManagement;