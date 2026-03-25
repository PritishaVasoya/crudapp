import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        navigate('/login');
    }

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
        console.log("🚀 ~ handleSubmit ~ form:", form)
        try {
            const res = await axios.post('http://localhost:5000/register', form);
            console.log(res.data);

            alert("User Registered Successfully");
            setForm(initialFormState);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div style={{ padding: "20px" }} className='container'>
            <h2>Register</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputName1" className="form-label">Name</label>
                    <input type="text" className="form-control" id="exampleInputName1" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" name="password" value={form.password} placeholder="Password" onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-primary" onClick={handleSignUpClick}>Register </button>
            </form>
        </div>
    )
}

export default Registration
