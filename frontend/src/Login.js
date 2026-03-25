import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        navigate('/products');
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            console.log("🚀 ~ handleSubmit ~ response:", response.data)
            localStorage.setItem('token', response.data.token);
            alert("Login Successfully!")
        } catch (error) {
            alert('Login failed: Invalid credentials');
        }
    };

    return (
        <div style={{ padding: "20px" }} className='container'>
            <h2>Login</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                </div>
                <button type="submit" className="btn btn-primary" onSubmit={handleSubmit} onClick={handleSignUpClick}>Submit</button>
            </form>
        </div>
    )
}

export default Login
