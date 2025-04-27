import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleEdit = () => {
    navigate('/profile/edit');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await axios.delete('http://localhost:5000/auth/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('token');
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>No profile data found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={true} />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto flex gap-8">
          {/* Profile Details */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-gray-600">Name</p>
                <p className="text-xl">{user.name}</p>
              </div>
              
              <div className="border-b pb-4">
                <p className="text-gray-600">Email</p>
                <p className="text-xl">{user.email}</p>
              </div>

              <div className="border-b pb-4">
                <p className="text-gray-600">Phone Number</p>
                <p className="text-xl">{user.contact || 'Not provided'}</p>
              </div>

              <div className="border-b pb-4">
                <p className="text-gray-600">Address</p>
                <p className="text-xl">{user.address || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Side Image */}
          <div className="hidden lg:block w-1/2 relative rounded-lg overflow-hidden">
            <img 
              src="/bg2.jpg" 
              alt="Profile Background" 
              className="w-full h-full object-cover"
            />
            {/* <div className="absolute inset-0 bg-black bg-opacity-30"></div> */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
