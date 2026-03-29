import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginSignup from './components/LoginSignup';
import FoodList from './components/FoodList';
import Cart from './components/Cart';
import api from './api';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/auth/me');
                setUser(res.data);
            } catch (err) {
                // Not authenticated
            }
        };
        checkAuth();
    }, []);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <Navbar user={user} setUser={setUser} />
            <Routes>
                <Route path="/" element={<FoodList user={user} />} />
                <Route path="/login" element={<LoginSignup setUser={setUser} />} />
                <Route path="/cart" element={<Cart user={user} />} />
            </Routes>
        </div>
    );
}

export default App;
