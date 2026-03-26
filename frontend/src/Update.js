import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Update = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        brand: '',
        gender: '',
        price: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(
                    `http://localhost:5000/getSingleWatch/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}` 
                        }
                    }
                );
                setForm(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!form.brand || !form.gender || !form.price) {
            setError('All fields are required');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/updateWatchData/${id}`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            navigate('/products');
        } catch (error) {
            console.error(error);
            setError('Update failed');
        }
    };

    return (
        <div className="container p-4">
            <h2>Update Watch</h2>

            {error && <p className="text-danger">{error}</p>}

            <form onSubmit={handleUpdate}>
                <div className="mb-3">
                    <label>Brand</label>
                    <input
                        type="text"
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label>Gender</label>
                    <input
                        type="text"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Update
                </button>

                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate('/products')}
                >
                    Back
                </button>
            </form>
        </div>
    );
};

export default Update;