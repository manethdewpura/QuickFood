import * as orderService from "../services/order.service.js";

export const createNewOrder = async (req, res) => {
  try {
    const { customerId, restaurantId, customerLatitude, customerLongitude } =
      req.body;

    // Validate required fields
    if (
      !customerId ||
      !restaurantId ||
      !customerLatitude ||
      !customerLongitude
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const order = await orderService.createOrder({
      customerId,
      restaurantId,
      customerLatitude,
      customerLongitude,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error in createNewOrder:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error creating order",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    if (!orderId || !orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    const updatedOrder = await orderService.updateOrderStatus(
      orderId,
      orderStatus
    );

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error updating order status",
    });
  }
};

export const getReadyOrders = async (req, res) => {
  try {
    const orders = await orderService.getReadyOrders();

    return res.status(200).json({
      success: true,
      message: "Ready orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error in getReadyOrders:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching ready orders",
    });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    const orders = await orderService.getCustomerOrders(customerId);

    return res.status(200).json({
      success: true,
      message: "Customer orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error in getCustomerOrders:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching customer orders",
    });
  }
};
