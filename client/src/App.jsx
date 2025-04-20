import React from 'react'
import { Routes, Route } from "react-router-dom";
import PaymentForm from './pages/Payment/PaymentForm.jsx';
import WelcomePage from './pages/Home/WelcomePage.js';
import HomePage from './pages/Home/HomePage.js';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/payment" element={<PaymentForm />} />
    </Routes>
  );
}

export default App;
