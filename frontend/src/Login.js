import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                email,
                password
            });

            localStorage.setItem('token', response.data.token);
            alert("Login Successful");
            navigate('/products');

        } catch (error) {
            alert("Invalid credentials");
        }
    };

    return (
        <div className='container p-4'>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="form-control mb-2" />

                <input type="password" placeholder="Password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="form-control mb-2" />

                <button type="submit" className="btn btn-success">Login</button>
            </form>
        </div>
    );
};

export default Login;