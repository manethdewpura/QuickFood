import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUsers, FaUtensils, FaClipboardList, FaChevronLeft } from 'react-icons/fa';

const SideNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: '/admin/users', title: 'Users', icon: <FaUsers /> },
    { path: '/admin/restaurants', title: 'Restaurants', icon: <FaUtensils /> },
    { path: '/admin/orders', title: 'Orders', icon: <FaClipboardList /> },
  ];

  return (
    <div 
      className={`h-screen bg-white shadow-lg fixed left-0 top-0 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-9 bg-white rounded-full p-1.5 shadow-md"
      >
        <FaChevronLeft className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      <div className="p-4 mb-8">
        <Link to="/admin" className={`text-blue-600 font-bold ${isCollapsed ? 'text-xl' : 'text-2xl'}`}>
          {isCollapsed ? 'QF' : 'QuickFood'}
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
            <span className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              {item.title}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default SideNav;
