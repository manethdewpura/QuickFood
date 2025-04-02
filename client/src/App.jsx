import React from 'react'
import { Routes, Route } from "react-router-dom";
import PaymentPage from "./pages/PaymentPage";

const App = () => {
  return (
    <Routes>
      <Route path="/payment" element={<PaymentPage />} />
    </Routes>
  );
}

export default App;
