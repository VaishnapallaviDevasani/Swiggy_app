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

    const [errors, setErrors] = useState({});

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

    const validate = () => {
        let newErrors = {};

        // NAME VALIDATION
        if (!food.name.trim()) {
            newErrors.name = "Name is required";
        } else if (/^\d/.test(food.name)) {
            newErrors.name = "Name cannot start with a number";
        } else if (/\d/.test(food.name)) {
            newErrors.name = "Name cannot contain numbers";
        } else if (food.name.length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        } else if (food.name.length > 50) {
            newErrors.name = "Name cannot exceed 50 characters";
        }

        // PRICE VALIDATION
        if (!food.price) {
            newErrors.price = "Price is required";
        } else if (food.price <= 0) {
            newErrors.price = "Price must be greater than 0";
        } else if (food.price > 10000) {
            newErrors.price = "Price seems too large";
        }

        // DESCRIPTION VALIDATION
        if (!food.description.trim()) {
            newErrors.description = "Description is required";
        } else if (/^\d/.test(food.description)) {
            newErrors.description = "Description cannot start with a number";
        } else if (/^\d+$/.test(food.description)) {
            newErrors.description = "Description cannot be only numbers";
        } else if (food.description.length < 10) {
            newErrors.description = "Description must be at least 10 characters";
        } else if (food.description.length > 200) {
            newErrors.description = "Description cannot exceed 200 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

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
                
                {/* NAME */}
                <div>
                    <input 
                        name="name"
                        type="text"
                        placeholder="Food Name"
                        value={food.name}
                        onChange={handleChange}
                        style={{ padding: '8px', width: '100%' }}
                    />
                    {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}
                </div>

                {/* PRICE */}
                <div>
                    <input 
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={food.price}
                        onChange={handleChange}
                        style={{ padding: '8px', width: '100%' }}
                    />
                    {errors.price && <span style={{ color: 'red', fontSize: '12px' }}>{errors.price}</span>}
                </div>

                {/* DESCRIPTION */}
                <div>
                    <textarea 
                        name="description"
                        placeholder="Description"
                        rows="4"
                        value={food.description}
                        onChange={handleChange}
                        style={{ padding: '8px', width: '100%' }}
                    />
                    {errors.description && <span style={{ color: 'red', fontSize: '12px' }}>{errors.description}</span>}
                </div>

                {/* BUTTON */}
                <button 
                    type="submit"
                    style={{
                        padding: '10px',
                        background: '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {isEdit ? 'Update Food' : 'Save Food'}
                </button>

            </form>
        </div>
    );
};

export default FoodForm;
