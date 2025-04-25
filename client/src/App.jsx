import React from 'react'
import { Routes, Route } from "react-router-dom";
import PaymentForm from './pages/Payment/PaymentForm.jsx';
import WelcomePage from './pages/Home/WelcomePage.jsx';
import HomePage from './pages/Home/HomePage.jsx';
import { LocationProvider } from "./context/LocationContext";
import LoginForm from './pages/Auth/LoginForm.jsx';
import SignUpForm from './pages/Auth/SignUpForm.jsx';
import RestaurantHome from './pages/Restaurant/RestaurantHome.jsx';
import RestaurantDetails from './pages/Restaurant/RestaurantDetails.jsx';
import RestaurantMenu from './pages/Restaurant/RestaurantMenu.jsx';

const App = () => {
  return (
    <LocationProvider>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/restaurantHome" element={<RestaurantHome />} />
        <Route path="/restaurant/management" element={<RestaurantDetails />} />
        <Route path="/restaurant/menu" element={<RestaurantMenu />} />

      </Routes>
    </LocationProvider>
  );
}

export default App;
