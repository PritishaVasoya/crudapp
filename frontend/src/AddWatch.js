import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddWatch = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    brand: '',
    gender: '',
    price: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.brand || !form.gender || !form.price) {
      setError('All fields are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        'http://localhost:5000/addWatch',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate('/products');

    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }
  };

  return (
    <div className="container p-4">
      <h2>Add Watch</h2>

      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter brand"
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
            placeholder="Enter gender"
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
            placeholder="Enter price"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Watch
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

export default AddWatch;