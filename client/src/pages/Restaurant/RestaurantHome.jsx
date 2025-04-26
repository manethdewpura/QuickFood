import React from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantHome = () => {
  const navigate = useNavigate();

  const cards = [
    // {
    //   title: "Menu",
    //   description: "Manage your restaurant menu items.",
    //   image:
    //     "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80", 
    //   action: () => navigate("/restaurant/menu"),
    // },
    {
      title: "Management",
      description: "Update restaurant details and settings.",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80", 
      action: () => navigate("/restaurant/management"),
    },
    {
      title: "Orders",
      description: "View and handle incoming customer orders.",
      image:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80",
      action: () => navigate("/restaurant/incomingOrders"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
        Restaurant Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={card.action}
            className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 overflow-hidden"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2 text-center">
                {card.title}
              </h2>
              <p className="text-gray-600 text-center">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantHome;
