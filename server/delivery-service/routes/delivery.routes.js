import express from 'express';
import * as deliveryController from '../controllers/delivery.controller.js';

const router = express.Router();

// Create a new delivery
router.post('/', deliveryController.createDelivery);

// Get deliveries by driver
router.get('/driver', deliveryController.getDeliveriesByDriver);

// Get deliveries by customer
router.get('/customer', deliveryController.getDeliveriesByCustomer);

// Get deliveries by restaurant
router.get('/restaurant/:restaurantId', deliveryController.getDeliveriesByRestaurant);

// Get delivery by ID
router.get('/:id', deliveryController.getDeliveryById);

// Update delivery status
router.patch('/:id/status', deliveryController.updateDeliveryStatus);

// Update driver location
router.patch('/:id/location', deliveryController.updateDriverLocation);

// Verify delivery code
router.get('/verification/:orderId/:verificationCode', deliveryController.verifyDeliveryCode);


export default router;
