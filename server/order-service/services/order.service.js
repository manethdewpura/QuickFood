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
    console.log(
      "Orders after fetching restaurant details:",
      ordersWithRestaurantDetails
    );
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
    // Fetch customer, restaurant, and menu details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        try {
          // Fetch customer details
          const customerResponse = await axios.get(
            `http://localhost:5000/auth/user`,
            {
              headers: {
                "x-user-id": order.customerId.toString(), // Pass as string
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDUwMzk1Y2RmMmI2ZjkwYWVjYTA3ZSIsInJvbGUiOiJTeXN0ZW1BZG1pbiIsImlhdCI6MTc0NTY0NjkzMywiZXhwIjoxNzQ2MjUxNzMzfQ.by4Jus4Zb4N7Ux-8vXWR_K96f-KxSzy7C37e6f1nPLE`,
              },
            }
          );
          const customerData = customerResponse.data;
          console.log(customerData, "customerData");

          // Fetch restaurant details
          const restaurantResponse = await axios.get(
            `http://localhost:5007/restaurantAll/${order.restaurantId}`
          );
          const restaurantData = restaurantResponse.data;
          console.log(restaurantData, "restaurantData");

          // Fetch menu details for each item in the order
          const itemsWithMenuDetails = await Promise.all(
            order.items.map(async (item) => {
              try {
                const menuResponse = await axios.get(
                  `http://localhost:5003/menu/${item.menuItemId}`
                );
                const menuData = menuResponse.data;
                return {
                  menuItem: menuData,
                };
              } catch (error) {
                console.error(
                  `Error fetching menu item ${item.menuItemId}:`,
                  error
                );
                return item; // Return the item without menu details
              }
            })
          );

          return {
            ...order.toObject(),
            customer: {
              customerData,
            },
            restaurant: {
              restaurantData
            },
            items: itemsWithMenuDetails,
          };
        } catch (error) {
          console.error(
            `Error fetching details for order ${order._id}:`,
            error
          );
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

// Get all orders
export const getAllOrders = async () => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    // Fetch restaurant and customer details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        try {
          const restaurantResponse = await axios.get(
            `http://localhost:5007/restaurantAll/${order.restaurantId}`
          );
          const restaurantData = restaurantResponse.data.data;

          const customerResponse = await axios.get(
            `http://localhost:5000/auth/user`,
            {
              headers: {
                "x-user-id": order.customerId,
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDUwMzk1Y2RmMmI2ZjkwYWVjYTA3ZSIsInJvbGUiOiJTeXN0ZW1BZG1pbiIsImlhdCI6MTc0NTY0NjkzMywiZXhwIjoxNzQ2MjUxNzMzfQ.by4Jus4Zb4N7Ux-8vXWR_K96f-KxSzy7C37e6f1nPLE`,
              },
            }
          );
          const customerData = customerResponse.data.user;

          return {
            ...order.toObject(),
            restaurant: {
              name: restaurantData.restaurantName,
              location: restaurantData.location,
            },
            customer: {
              name: customerData.name,
              location: customerData.location,
            },
          };
        } catch (error) {
          console.error(
            `Error fetching restaurant or customer details for order ${order._id}:`,
            error
          );
          return order;
        }
      })
    );
    return ordersWithDetails;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw new Error("Failed to fetch all orders: " + error.message);
  }
};
