import React from 'react'
import { Routes, Route } from "react-router-dom";
import PaymentForm from './pages/Payment/PaymentForm.jsx';
import WelcomePage from './pages/Home/WelcomePage.js';
import HomePage from './pages/Home/HomePage.js';
import LoginForm from './pages/Auth/LoginForm.jsx';
import RestaurantHome from './pages/Restaurant/RestaurantHome.jsx';
import SignUpForm from './pages/Auth/SignUpForm.jsx';
import RestaurantForm from './pages/Restaurant/RestaurantDetails.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/payment" element={<PaymentForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/RestaurantHome" element={<RestaurantHome />} />
      <Route path="/restaurant/management" element={<RestaurantForm />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;
