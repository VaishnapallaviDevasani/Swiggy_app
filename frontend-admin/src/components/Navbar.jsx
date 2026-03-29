import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#333', color: 'white' }}>
            <h2><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Food Ordering (Admin Panel)</Link></h2>
            <div>
                {user ? (
                    <>
                        <span style={{ marginRight: '15px' }}>Welcome, {user.username}</span>
                        <Link to="/" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Dashboard</Link>
                        <Link to="/add-food" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Add Food</Link>
                        <button onClick={handleLogout} style={{ background: 'white', color: '#333', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>Logout</button>
                    </>
                ) : (
                    <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
