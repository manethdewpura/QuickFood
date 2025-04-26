import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import AdminHeader from '../../../components/Admin/AdminHeader';
import SideNav from '../../../components/Admin/SideNav';

const OrderList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders] = useState([
    {
      id: 1,
      customer: 'John Doe',
      restaurant: 'Pizza Place',
      status: 'Delivered',
      total: 29.99,
      date: '2024-01-20'
    },
    {
      id: 2,
      customer: 'Jane Smith',
      restaurant: 'Burger Hub',
      status: 'In Progress',
      total: 45.50,
      date: '2024-01-20'
    },
  ]);

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="fixed inset-y-0 left-0 z-50">
        <SideNav />
      </div>
      <div className="ml-16 lg:ml-64 flex-1 transition-all duration-300">
        <AdminHeader />
        <div className="max-w-7xl mx-auto p-4 mt-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>
          
          <div className="mb-4 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.restaurant}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${order.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
