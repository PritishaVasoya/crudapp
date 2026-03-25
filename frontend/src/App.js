import React, { useState } from 'react';
import axios from "axios";
import './App.css';
import Login from './Login';
import Navbar from './Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './Registration';
import Crud from './Crud';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Crud />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;