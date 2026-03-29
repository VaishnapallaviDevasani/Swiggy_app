import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const FoodForm = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [food, setFood] = useState({
        name: '',
        price: '',
        description: ''
    });

    useEffect(() => {
        if (isEdit) {
            api.get('/foods').then(res => {
                const existingFood = res.data.find(f => f.id === parseInt(id));
                if (existingFood) {
                    setFood({
                        name: existingFood.name,
                        price: existingFood.price,
                        description: existingFood.description
                    });
                }
            }).catch(err => console.error(err));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFood({ ...food, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await api.put(`/foods/${id}`, food);
                alert('Food updated successfully!');
            } else {
                await api.post('/foods', food);
                alert('Food added successfully!');
            }
            navigate('/');
        } catch (err) {
            console.error('Error saving food', err);
            alert('Failed to save food');
        }
    };

    if (!user) return <div style={{ padding: '20px' }}>Please login first.</div>;

    return (
        <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>{isEdit ? 'Edit Food' : 'Add New Food'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    name="name" type="text" placeholder="Food Name" required 
                    value={food.name} onChange={handleChange} style={{ padding: '8px' }} 
                />
                <input 
                    name="price" type="number" step="0.01" placeholder="Price" required 
                    value={food.price} onChange={handleChange} style={{ padding: '8px' }} 
                />
                <textarea 
                    name="description" placeholder="Description" rows="4" 
                    value={food.description} onChange={handleChange} style={{ padding: '8px' }} 
                />
                <button type="submit" style={{ padding: '10px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {isEdit ? 'Update Food' : 'Save Food'}
                </button>
            </form>
        </div>
    );
};

export default FoodForm;
