import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/Home/WelcomePage.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import { LocationProvider } from "./context/LocationContext";
import LoginForm from "./pages/Auth/LoginForm.jsx";
import SignUpForm from "./pages/Auth/SignUpForm.jsx";
import RestaurantHome from "./pages/Restaurant/RestaurantHome.jsx";
import RestaurantDetails from "./pages/Restaurant/RestaurantDetails.jsx";
import RestaurantMenu from "./pages/Restaurant/RestaurantMenu.jsx";
import DeliveryPage from "./pages/Delivery/DeliveryPage.jsx";
import DriverDashboard from "./pages/Delivery/DriverDashboard.jsx";
import TrackDelivery from "./pages/Home/TrackDelivery.jsx";
import CreateDriverForm from "./pages/Delivery/CreateDriver.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import UserList from "./pages/Admin/Users/UserList.jsx";
import RestaurantList from "./pages/Admin/Restaurants/RestaurantList.jsx";
import OrderList from "./pages/Admin/Orders/OrderList.jsx";
import CustomerRestaurantMenu from "./pages/Home/CustomerRestaurantMenu.jsx";
import RestaurantOrders from "./pages/Restaurant/RestaurantOrders.jsx";
import Cart from "./pages/Home/Cart.jsx";
import Checkout from "./pages/Home/Checkout.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import EditProfile from "./pages/Profile/EditProfile.jsx";
import CustomerOrders from "./pages/Home/CustomerOrders.jsx";

const App = () => {
  return (
    <LocationProvider>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/restaurantHome" element={<RestaurantHome />} />
        <Route path="/restaurant/management" element={<RestaurantDetails />} />
        <Route path="/restaurant/menu/:id" element={<RestaurantMenu />} />
        <Route path="/driver/delivery/:id" element={<DeliveryPage />} />
        <Route path="/driver/create" element={<CreateDriverForm />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/track-delivery/:id" element={<TrackDelivery />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/restaurants" element={<RestaurantList />} />
        <Route path="/admin/orders" element={<OrderList />} />
        <Route
          path="/customer-restaurant/menu"
          element={<CustomerRestaurantMenu />}
        />
        <Route path="/restaurant/order/:id" element={<RestaurantOrders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/customer/orders" element={<CustomerOrders />} />
      </Routes>
    </LocationProvider>
  );
};

export default App;
