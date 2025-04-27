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
    const cartData = await getCartItems(customerId, restaurantId);

    const cartItems = cartData?.items;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      console.error("Invalid cart items:", cartItems);
      throw new Error("Cart is empty or invalid");
    }

    const cartItemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
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
    let totalAmount = 0;
    for (const item of cartItemsWithDetails) {
      const menuItemData = item.menuItem?.data;
      if (!menuItemData || typeof menuItemData.price !== "number") {
        console.error("Invalid menu item:", item);
        throw new Error(`Invalid menu item data for item ${item.menuItemId}`);
      }
      totalAmount += menuItemData.price * item.quantity;
    }
    if (isNaN(totalAmount) || totalAmount <= 0) {
      throw new Error(`Invalid total amount calculated: ${totalAmount}`);
    }
    const items = cartItemsWithDetails.map((item) => {
      const menuItemData = item.menuItem?.data;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItemData.price,
      };
    });
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
          return order.toObject();
        }
      })
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
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        try {
          const response = await axios.get(
            `http://localhost:5007/restaurantAll/${order.restaurantId}`
          );
          const restaurantData = response.data.data;

          const itemsWithMenuDetails = await Promise.all(
            order.items.map(async (item) => {
              try {
                const menuResponse = await axios.get(
                  `http://localhost:5003/menu/${item.menuItemId}`
                );
                const menuData = menuResponse.data;
                return {
                  menuItemId: item.menuItemId,
                  quantity: item.quantity,
                  menuItemDetails: menuData,
                };
              } catch (error) {
                return {
                  menuItemId: item.menuItemId,
                  quantity: item.quantity,
                  menuItemDetails: {},
                };
              }
            })
          );
          const deliveryResponse = await axios
            .get(`http://localhost:5002/delivery/order/${order._id}`)
            .catch((error) => {
              return { data: {} };
            });

          return {
            orderId: order._id,
            customerId: order.customerId,
            restaurant: {
              id: order.restaurantId,
              name: restaurantData?.restaurantName || "Unknown",
              location: restaurantData?.location || {},
            },
            items: itemsWithMenuDetails,
            totalAmount: order.totalAmount,
            orderStatus: order.orderStatus,
            deliveryDetails: deliveryResponse.data,
          };
        } catch (error) {
          console.error(
            `Error fetching restaurant ${order.restaurantId}:`,
            error
          );
          return {
            orderId: order._id,
            customerId: order.customerId,
            restaurant: {
              id: order.restaurantId,
              name: "Unknown",
              location: {},
            },
            items: order.items,
            totalAmount: order.totalAmount,
            orderStatus: order.orderStatus,
            deliveryDetails: {},
          };
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
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        try {
          const customerResponse = await axios.get(
            `http://localhost:5000/auth/user/other`,
            {
              headers: {
                "x-user-id": order.customerId.toString(),
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDUwMzk1Y2RmMmI2ZjkwYWVjYTA3ZSIsInJvbGUiOiJTeXN0ZW1BZG1pbiIsImlhdCI6MTc0NTY0NjkzMywiZXhwIjoxNzQ2MjUxNzMzfQ.by4Jus4Zb4N7Ux-8vXWR_K96f-KxSzy7C37e6f1nPLE`,
              },
            }
          );
          const customerData = customerResponse.data;
          const restaurantResponse = await axios.get(
            `http://localhost:5007/restaurantAll/${order.restaurantId}`
          );
          const restaurantData = restaurantResponse.data;

          const itemsWithMenuDetails = await Promise.all(
            order.items.map(async (item) => {
              try {
                const menuResponse = await axios.get(
                  `http://localhost:5003/menu/${item.menuItemId}`
                );
                const menuData = menuResponse.data;
                return {
                  menuItem: menuData,
                  quantity: item.quantity,
                };
              } catch (error) {
                console.error(
                  `Error fetching menu item ${item.menuItemId}:`,
                  error
                );
                return item;
              }
            })
          );

          return {
            ...order.toObject(),
            customer: {
              customerData,
            },
            restaurant: {
              restaurantData,
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
    const response = await axios.get(
      `http://localhost:5007/restaurantAll/${order.restaurantId}`
    );
    const restaurantData = response.data.data;
    return {
      ...order.toObject(),
      restaurant: {
        name: restaurantData.restaurantName,
        address: restaurantData.Address,
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
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        try {
          const restaurantResponse = await axios.get(
            `http://localhost:5007/restaurantAll/${order.restaurantId}`
          );
          const restaurantData = restaurantResponse.data.data;

          const customerResponse = await axios.get(
            `http://localhost:5000/auth/user/other`,
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

export const updateOrderAccept = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.isOrderAccepted = true;
    await order.save();
    return order;
  } catch (error) {
    console.error("Error updating order acceptance:", error);
    throw new Error("Failed to update order acceptance: " + error.message);
  }
};
