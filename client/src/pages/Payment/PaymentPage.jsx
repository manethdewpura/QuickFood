import React,{ useState } from 'react';
import axios from 'axios';

function PaymentPage() {
  const [formData, setFormData] = useState({
    order_id: '',
    amount: '',
    currency: 'LKR',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });
  const [hash, setHash] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/payment', {
        sandbox: true,
        merchant_id: 'YOUR_MERCHANT_ID',
        return_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
        notify_url: 'http://localhost:5000/api/payment/notify',
        order_id: formData.order_id,
        items: 'Sample Item',
        amount: formData.amount,
        currency: formData.currency,
        hash: hash,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: 'Sri Lanka',
      });
      setHash(data.hash);
      document.getElementById('payment-form').submit();
    } catch (error) {
      console.error('Error generating hash:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">PayHere Payment</h1>
        <form
          id="payment-form"
          method="post"
          action="https://sandbox.payhere.lk/pay/checkout"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input type="hidden" name="merchant_id" value="YOUR_MERCHANT_ID" />
          <input type="hidden" name="return_url" value="http://localhost:3000/success" />
          <input type="hidden" name="cancel_url" value="http://localhost:3000/cancel" />
          <input type="hidden" name="notify_url" value="http://localhost:5000/api/payment/notify" />
          <input type="hidden" name="items" value="Sample Item" />
          <input type="hidden" name="country" value="Sri Lanka" />
          <input type="hidden" name="hash" value={hash} />

          <div>
            <label className="block text-sm font-medium text-gray-700">Order ID:</label>
            <input
              type="text"
              name="order_id"
              value={formData.order_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount:</label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency:</label>
            <input
              type="text"
              name="currency"
              value={formData.currency}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentPage;
