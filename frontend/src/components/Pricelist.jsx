import { useEffect, useState } from 'react';
import axios from 'axios';

const Pricelist = () => {
    const [pricelists, setPricelists] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [desiredTimeline, setDesiredTimeline] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPricelists = async () => {
            try {
                // Removed the unused response variable
                await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/pricelist`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }).then(response => {
                    setPricelists(response.data);
                });
            } catch {
                setError('Error fetching pricelist'); // Removed the unused err variable
            }
        };

        fetchPricelists();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Removed the unused response variable
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/tasks`, {
                title: selectedService,
                description: `Requested service: ${selectedService}`,
                deadline: desiredTimeline,
                resources: [], // You can add resources if needed
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('Service request submitted successfully!');
            // Reset the form
            setSelectedService('');
            setDesiredTimeline('');
        } catch {
            setError('Error submitting service request'); // Removed the unused err variable
        }
    };

    return (
        <div>
            <h2>Available Services</h2>
            {error && <p className="text-red-500">{error}</p>}
            <ul>
                {pricelists.map(item => (
                    <li key={item._id}>
                        <h3>{item.itemName}</h3>
                        <p>Price: ${item.price}</p>
                        <p>{item.description}</p>
                        <button onClick={() => setSelectedService(item.itemName)}>Select</button>
                    </li>
                ))}
            </ul>
            {selectedService && (
                <form onSubmit={handleSubmit} className="mt-4">
                    <h3>Request Service: {selectedService}</h3>
                    <input
                        type="date"
                        value={desiredTimeline}
                        onChange={(e) => setDesiredTimeline(e.target.value)}
                        required
                        className="border p-2 mb-2 w-full"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit Request</button>
                </form>
            )}
        </div>
    );
};

export default Pricelist;