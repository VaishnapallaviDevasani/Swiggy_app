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
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#e23744', color: 'white' }}>
            <h2><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Food Ordering (Customer)</Link></h2>
            <div>
                <Link to="/" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Home</Link>
                {user ? (
                    <>
                        <Link to="/cart" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Cart</Link>
                        <button onClick={handleLogout} style={{ background: 'white', color: '#e23744', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>Logout</button>
                    </>
                ) : (
                    <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login / Signup</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
