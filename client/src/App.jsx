import React from 'react'
import { Routes, Route } from "react-router-dom";
import PaymentPage from "./pages/Payment/PaymentPage.jsx";
import PaymentForm from './pages/Payment/PaymentForm.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/payment-form" element={<PaymentForm />} />
    </Routes>
  );
}

export default App;
