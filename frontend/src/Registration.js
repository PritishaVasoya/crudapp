import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const navigate = useNavigate();

    const initialFormState = {
        name: '',
        email: '',
        password: ''
    };

    const [form, setForm] = useState(initialFormState);
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/register', form);
            alert("User Registered Successfully");
            setForm(initialFormState);
            navigate('/login');

        } catch (error) {
            console.error(error);
            alert("Registration failed");
        }
    };

    return (
        <div className='container p-4'>
            <h2>Register</h2>

            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name"
                    value={form.name} onChange={handleChange} className="form-control mb-2" />

                <input type="email" name="email" placeholder="Email"
                    value={form.email} onChange={handleChange} className="form-control mb-2" />

                <input type="password" name="password" placeholder="Password"
                    value={form.password} onChange={handleChange} className="form-control mb-2" />

                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default Registration;