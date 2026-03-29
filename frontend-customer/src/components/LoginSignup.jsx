import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const LoginSignup = ({ setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const res = await api.post('/auth/login', { username, password });
                setUser(res.data);
                navigate('/');
            } else {
                await api.post('/auth/register', { email,username, password, role: 'CUSTOMER' });
                setIsLogin(true);
                setEmail('');
                setUsername('');
                setPassword('');
                alert('Registered successfully! Please login.');
            }
        } catch (err) {
            setError(err.response?.data || 'An error occurred');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>{isLogin ? 'Customer Login' : 'Customer Signup'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {isLogin ? null : <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '8px' }} />}
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required style={{ padding: '8px' }} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '8px' }} />
                <button type="submit" style={{ padding: '10px', background: '#e23744', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {isLogin ? 'Login' : 'Signup'}
                </button>
            </form>
            <p style={{ marginTop: '10px', cursor: 'pointer', color: 'blue' }} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Don't have an account? Signup here" : "Already have an account? Login here"}
            </p>
        </div>
    );
};

export default LoginSignup;
