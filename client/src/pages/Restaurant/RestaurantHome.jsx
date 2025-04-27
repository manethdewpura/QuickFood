import React from "react";
import { useNavigate } from "react-router-dom";
import RestaurantAdminHeader from "./RestaurantHeader.jsx";
import Footer from "../../components/Footer.jsx";

const RestaurantHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <RestaurantAdminHeader />
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
          Restaurant Dashboard
        </h1>
        <div className="w-full max-w-6xl">
          <div
            onClick={() => navigate("/restaurant/management")}
            className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
              alt="Management"
              className="w-full h-40 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2 text-center">
                Restaurant Management
              </h2>
              <p className="text-gray-600 text-center">
                Update Orders, manage menu items and restaurant details.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-55">
        <Footer />
      </div>
    </div>
  );
};

export default RestaurantHome;
