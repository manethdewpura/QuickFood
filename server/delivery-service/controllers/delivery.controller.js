import * as deliveryService from '../services/delivery.service.js';

export const createDelivery = async (req, res) => {
  try {
    const orderData = req.body;
    const delivery = await deliveryService.createDelivery(orderData);
    res.status(201).json(delivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await deliveryService.getDeliveryById(id);
    res.status(200).json(delivery);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, currentLocation } = req.body;
    const updatedDelivery = await deliveryService.updateDeliveryStatus(id, status, currentLocation);
    res.status(200).json(updatedDelivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add this to your existing controller
export const updateDriverLocation = async (req, res) => {
    try {
      const { id } = req.params;
      const { currentLocation } = req.body;
      const updatedDelivery = await deliveryService.updateDriverLocation(id, currentLocation);
      res.status(200).json(updatedDelivery);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

export const verifyDeliveryCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;
    const isValid = await deliveryService.verifyDeliveryCode(id, code);
    res.status(200).json({ valid: isValid });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDeliveriesByDriver = async (req, res) => {
  try {
    const driverId = req.headers['x-user-id'];
    const deliveries = await deliveryService.getDeliveriesByDriver(driverId);
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDeliveriesByCustomer = async (req, res) => {
  try {
    const customerId = req.headers['x-user-id'];
    const deliveries = await deliveryService.getDeliveriesByCustomer(customerId);
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDeliveriesByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const deliveries = await deliveryService.getDeliveriesByRestaurant(restaurantId);
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
