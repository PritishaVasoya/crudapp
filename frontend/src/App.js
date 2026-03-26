import './App.css';
import Login from './Login';
import Navbar from './Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './Registration';
import Crud from './Crud';
import ProtectedRoute from './ProductedRoute';
import AddWatch from './AddWatch';
import Update from './Update';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/add" element={<AddWatch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/update/:id" element={<Update />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Crud />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;