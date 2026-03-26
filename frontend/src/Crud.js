import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Crud = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const res = await axios.get('http://localhost:5000/showWatchData', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error:", error);
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/deleteWatchData/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchProducts();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='container p-4'>
      <h2>Watch Data Table</h2>
      <button onClick={() => navigate('/add')} className="btn btn-primary mb-3">
        Add Watch
      </button>
      <button onClick={handleLogout} className="btn btn-danger mb-3 ms-2">
        Logout
      </button>
      <table className='table table-bordered text-center'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Gender</th>
            <th>Price</th>
            <th colSpan={2}>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr><td colSpan="6">Loading...</td></tr>
          ) : products.length > 0 ? (
            products.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.brand}</td>
                <td>{item.gender}</td>
                <td>{item.price}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => navigate(`/update/${item.id}`)}
                  >
                    Update
                  </button>
                </td>

                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Crud;