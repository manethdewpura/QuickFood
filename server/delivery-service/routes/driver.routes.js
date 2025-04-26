import express from 'express';
import * as driverController from '../controllers/driver.controller.js';

const router = express.Router();


// Update driver location
router.patch('/location', driverController.updateDriverLocation);

// Get all available drivers
router.get('/available', driverController.getAllAvailableDrivers);

// Create a new driver
router.post('/', driverController.createDriver);

// Get driver by ID
router.get('/', driverController.getDriverById);

router.get('/nearest-ready-orders', driverController.getNearestReadyOrders);

// Update driver availability
router.patch('/availability', driverController.updateDriverAvailability);

// Update driver rating
router.patch('/rating', driverController.updateDriverRating);

router.get('/:id', driverController.getDriverByIdParam);

export default router;
