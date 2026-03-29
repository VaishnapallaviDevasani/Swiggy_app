import React, { useEffect, useState } from 'react';
import api from '../api';

const Cart = ({ user }) => {
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        try {
            const res = await api.get('/cart');
            setCartItems(res.data);
        } catch (err) {
            console.error('Failed to fetch cart', err);
        }
    };

    useEffect(() => {
        if (user) fetchCart();
    }, [user]);

    const handleRemove = async (id) => {
        try {
            await api.delete(`/cart/${id}`);
            fetchCart();
        } catch (err) {
            console.error('Failed to remove item', err);
        }
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            alert('Cart is empty');
            return;
        }
        try {
            const res = await api.post('/orders');
            alert(res.data); // Should say Order placed successfully
            setCartItems([]);
        } catch (err) {
            console.error('Failed to place order', err);
            alert('Failed to place order');
        }
    };

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.food.price * item.quantity), 0);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? <p>Your cart is empty.</p> : (
                <div>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {cartItems.map(item => (
                            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ddd' }}>
                                <span>{item.food.name} (x{item.quantity}) - ${item.food.price * item.quantity}</span>
                                <button onClick={() => handleRemove(item.id)} style={{ background: '#e23744', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <h3>Total: ${totalAmount.toFixed(2)}</h3>
                    <button onClick={handlePlaceOrder} style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>Place Order</button>
                </div>
            )}
        </div>
    );
};

export default Cart;
