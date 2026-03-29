import React, { useEffect, useState } from 'react';
import api from '../api';

const FoodList = ({ user }) => {
    const [foods, setFoods] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const res = await api.get('/foods');
                setFoods(res.data);
            } catch (err) {
                console.error("Error fetching foods", err);
            }
        };
        fetchFoods();
    }, []);

    const addToCart = async (foodId) => {
        if (!user) {
            alert('Please login to add to cart');
            return;
        }
        try {
            await api.post('/cart/add', { foodId, quantity: 1 });
            alert('Added to cart!');
        } catch (err) {
            console.error('Failed to add to cart', err);
            alert('Failed to add to cart');
        }
    };

    const filteredFoods = foods.filter(food => food.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={{ padding: '20px' }}>
            <h2>Menu</h2>
            <input 
                type="text" 
                placeholder="Search food..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: '8px', marginBottom: '20px', width: '100%', maxWidth: '300px' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {filteredFoods.map(food => (
                    <div key={food.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                        <h3>{food.name}</h3>
                        <p>{food.description}</p>
                        <p style={{ fontWeight: 'bold' }}>${food.price}</p>
                        <button 
                            onClick={() => addToCart(food.id)}
                            style={{ background: '#e23744', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodList;
