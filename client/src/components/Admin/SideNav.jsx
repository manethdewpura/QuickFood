import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUsers, FaUtensils, FaClipboardList } from 'react-icons/fa';

const SideNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/users', title: 'Users', icon: <FaUsers /> },
    { path: '/admin/restaurants', title: 'Restaurants', icon: <FaUtensils /> },
    { path: '/admin/orders', title: 'Orders', icon: <FaClipboardList /> },
  ];

  return (
    <div className="h-screen bg-white shadow-lg fixed left-0 top-0 w-64">
      <div className="p-4 mb-8">
        <Link to="/admin" className="text-blue-600 font-bold text-2xl">
          QuickFood Admin
        </Link>
      </div>

      <nav className="space-y-2 px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors whitespace-nowrap
              ${location.pathname === item.path 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <div className="text-xl">{item.icon}</div>
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default SideNav;
