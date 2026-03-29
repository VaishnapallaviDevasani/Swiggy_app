import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = ({ user }) => {
    const [foods, setFoods] = useState([]);
    const navigate = useNavigate();

    const fetchFoods = async () => {
        try {
            const res = await api.get('/foods');
            setFoods(res.data);
        } catch (err) {
            console.error("Error fetching foods", err);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this food item?')) return;
        try {
            await api.delete(`/foods/${id}`);
            fetchFoods();
        } catch (err) {
            console.error('Failed to delete', err);
            alert('Failed to delete food item');
        }
    };

    if (!user) return <div style={{ padding: '20px' }}>Please login to view dashboard.</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Dashboard (Manage Foods)</h2>
            <button onClick={() => navigate('/add-food')} style={{ padding: '10px 15px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>
                Add New Food
            </button>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ background: '#f4f4f4' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Price</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Description</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {foods.map(food => (
                        <tr key={food.id}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{food.id}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{food.name}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>${food.price}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{food.description}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                <button onClick={() => navigate(`/edit-food/${food.id}`)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer', background: 'orange', color: '#fff', border: 'none', borderRadius: '4px' }}>Edit</button>
                                <button onClick={() => handleDelete(food.id)} style={{ padding: '5px 10px', cursor: 'pointer', background: 'red', color: '#fff', border: 'none', borderRadius: '4px' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {foods.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>No food items available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
