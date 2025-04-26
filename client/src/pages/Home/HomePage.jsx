import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import axios from "axios";
import { calculateDistance } from "../../utils/helpers";

const HomePage = () => {
  const [token] = React.useState(localStorage.getItem("token"));
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        axios
          .get(
            `http://localhost:5000/restaurantAll/nearest?latitude=${latitude}&longitude=${longitude}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            const restaurantsWithDistance = response.data.data.map(restaurant => ({
              ...restaurant,
              distance: calculateDistance(
                latitude,
                longitude,
                restaurant.location.latitude,
                restaurant.location.longitude
              )
            }));
            setRestaurants(restaurantsWithDistance);
          })
          .catch((error) => {
            console.error("Error fetching restaurants:", error);
          });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, [token]);

  const handleViewMenu = (restaurant) => {
    navigate("/customer-restaurant/menu", {
      state: {
        restaurant
        // restaurantId: restaurant._id,
        // restaurantName: restaurant.restaurantName,
        // location: restaurant.location,
        // latitude: restaurant.latitude,
        // longitude: restaurant.longitude,
      },
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={token !== null} onCartClick={() => {}} />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Nearby Restaurants</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">
                {restaurant.restaurantName}
              </h2>
              <p className="text-gray-600 mb-2">
                {restaurant.location?.latitude
                  ? `${restaurant.Address}`
                  : restaurant.location}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Hours:</span>{" "}
                {restaurant.OpeningHours}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Contact:</span>{" "}
                {restaurant.Hotline}
              </p>
              {restaurant.distance && (
                <p className="text-gray-600">
                  <span className="font-semibold">Distance:</span>{" "}
                  {(restaurant.distance / 1000).toFixed(1)} km
                </p>
              )}
              <div className="mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                onClick={() => handleViewMenu(restaurant)}>
                  View Menu
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
