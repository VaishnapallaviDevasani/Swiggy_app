import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FoodForm from './components/FoodForm';
import api from './api';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/auth/me');
                if (res.data.role === 'ROLE_ADMIN' || res.data.role === 'ADMIN') {
                    setUser(res.data);
                }
            } catch (err) {
                // Not authenticated or not admin
            }
        };
        checkAuth();
    }, []);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <Navbar user={user} setUser={setUser} />
            <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/add-food" element={<FoodForm user={user} />} />
                <Route path="/edit-food/:id" element={<FoodForm user={user} />} />
            </Routes>
        </div>
    );
}

export default App;
