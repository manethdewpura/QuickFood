import React from 'react'
import { Routes, Route } from "react-router-dom";
import PaymentForm from './pages/Payment/PaymentForm.jsx';
import WelcomePage from './pages/Home/WelcomePage.jsx';
import HomePage from './pages/Home/HomePage.jsx';
import { LocationProvider } from "./context/LocationContext";
import LoginForm from './pages/Auth/LoginForm.jsx';

const App = () => {
  return (
    <LocationProvider>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/login" element={<LoginForm />} />

      </Routes>
    </LocationProvider>
  );
}

export default App;
