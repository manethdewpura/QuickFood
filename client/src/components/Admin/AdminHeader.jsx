import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/admin" className="text-2xl font-bold text-blue-600">
          QuickFood Admin
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link to="/admin" className="text-gray-600 hover:text-blue-600">
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
