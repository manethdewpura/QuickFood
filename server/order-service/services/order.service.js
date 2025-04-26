import Order from "../models/order.model.js";
import mongoose from "mongoose";
import { getCartItems, clearCart } from "./cart.service.js";
import axios from "axios";

// Create a new order
export const createNewOrder = async (orderData) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { customerId, restaurantId, customerLatitude, customerLongitude } =
      orderData;
    // Get cart items
    const cartItems = await getCartItems(customerId, restaurantId);
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty");
    }
    const cartItemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        // Use cartItems here
        try {
          const response = await axios.get(
            `http://localhost:5003/menu/${item.menuItemId}`
          );
          const menuItem = response.data;
          return {
            menuItem: menuItem,
            quantity: item.quantity,
            menuItemId: item.menuItemId,
          };
        } catch (error) {
          console.error(`Error fetching menu item ${item.menuItemId}:`, error);
          return item;
        }
      })
    );
    // Calculate total amount
    let totalAmount = 0;
    for (const item of cartItemsWithDetails) {
      const menuItemData = item.menuItem?.data;
      if (!menuItemData || typeof menuItemData.price !== "number") {
        console.error("Invalid menu item:", item);
        throw new Error(`Invalid menu item data for item ${item.menuItemId}`);
      }
      totalAmount += menuItemData.price * item.quantity;
    }
    // Validate total amount
    if (isNaN(totalAmount) || totalAmount <= 0) {
      throw new Error(`Invalid total amount calculated: ${totalAmount}`);
    }
    // Create order items array
    const items = cartItemsWithDetails.map((item) => {
      const menuItemData = item.menuItem?.data;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItemData.price,
      };
    });
    // Create new order
    const newOrder = new Order({
      customerId,
      restaurantId,
      customerLatitude,
      customerLongitude,
      items,
      totalAmount,
      orderStatus: "Pending",
    });
    await newOrder.save({ session });
    await clearCart(customerId, restaurantId);
    await session.commitTransaction();
    return newOrder;
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating order:", error);
    throw new Error("Failed to create order: " + error.message);
  } finally {
    session.endSession();
  }
};

// Update order status
export const updateOrderStatus = async (orderId, orderStatus) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    // Validate the status
    const validStatuses = [
      "Pending",
      "In Progress",
      "Ready",
      "Accepted",
      "Picked Up",
      "In Transit",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(orderStatus)) {
      throw new Error("Invalid order status");
    }
    order.orderStatus = orderStatus;
    await order.save();
    return order;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status: " + error.message);
  }
};

// Get all ready orders
export const getReadyOrders = async () => {
  try {
    const orders = await Order.find({
      isOrderAccepted: true,
      orderStatus: "Ready",
    });
    if (!orders || orders.length === 0) {
      console.log("No ready orders found.");
      return [];
    }
    console.log("Orders before fetching restaurant details:", orders);
    // Fetch restaurant details for each order
    const ordersWithRestaurantDetails = await Promise.all(
      orders.map(async (order) => {
        try {
          const response = await axios.get(
            `http://localhost:5007/restaurantAll/${order.restaurantId}`
          );
          const restaurantData = response.data.data;
          return {
            ...order.toObject(),
            restaurant: {
              name: restaurantData.restaurantName,
              Address: restaurantData.Address,
              longitude: restaurantData.location.longitude,
              latitude: restaurantData.location.latitude,
            },
          };
        } catch (error) {
          console.error(
            `Error fetching restaurant ${order.restaurantId}:`,
            error
          );
          return order.toObject(); // Return the order without restaurant details
        }
      })
    );
    console.log("Orders after fetching restaurant details:", ordersWithRestaurantDetails);
    return ordersWithRestaurantDetails;
  } catch (error) {
    console.error("Error fetching ready orders:", error);
    throw new Error("Failed to fetch ready orders: " + error.message);
  }
};

// Get all orders for a customer
export const getCustomerOrders = async (customerId) => {
  try {
    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
    // Fetch restaurant details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        try {
          const response = await axios.get(
            `http://localhost:5007/restaurant/${order.restaurantId}`
          );
          const restaurantData = response.data.data;

          return {
            ...order.toObject(),
            restaurant: {
              name: restaurantData.restaurantName,
              location: restaurantData.location,
            },
          };
        } catch (error) {
          console.error(
            `Error fetching restaurant ${order.restaurantId}:`,
            error
          );
          return order;
        }
      })
    );
    return ordersWithDetails;
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    throw new Error("Failed to fetch customer orders: " + error.message);
  }
};

// Get all orders for a restaurant
export const getRestaurantOrders = async (restaurantId) => {
  try {
    const orders = await Order.find({ restaurantId }).sort({ createdAt: -1 });
    // Fetch customer details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        try {
          const response = await axios.get(`http://localhost:5000/customer`, {
            headers: {
              "x-user-id": order.customerId,
            },
          });
          const customerData = response.data.data;
          return {
            ...order.toObject(),
            customer: {
              name: customerData.name,
              location: customerData.location,
            },
          };
        } catch (error) {
          console.error(`Error fetching customer ${order.customerId}:`, error);
          return order;
        }
      })
    );
    return ordersWithDetails;
  } catch (error) {
    console.error("Error fetching restaurant orders:", error);
    throw new Error("Failed to fetch restaurant orders: " + error.message);
  }
};

// Get a specific order by ID
export const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    // Fetch restaurant details
    const response = await axios.get(
      `http://localhost:5007/restaurant/${order.restaurantId}`
    );
    const restaurantData = response.data.data;
    return {
      ...order.toObject(),
      restaurant: {
        name: restaurantData.restaurantName,
        location: restaurantData.location,
      },
    };
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw new Error("Failed to fetch order: " + error.message);
  }
};
