import express from "express";
import * as driverController from "../controllers/driver.controller.js";

const router = express.Router();

// Update driver location
router.patch("/location", driverController.updateDriverLocation);

// Get all available drivers
router.get("/available", driverController.getAllAvailableDrivers);

// Create a new driver
router.post("/", driverController.createDriver);

// Get driver by ID
router.get("/", driverController.getDriverById);

// Get nearest ready orders for the driver
router.get("/nearest-ready-orders", driverController.getNearestReadyOrders);

// Update driver availability
router.patch("/availability", driverController.updateDriverAvailability);

// Update driver rating
router.patch("/rating", driverController.updateDriverRating);

// Check if a driver exists for the authenticated user
router.get("/me", driverController.checkDriverByUserId);

//get driver details by id
router.get("/:id", driverController.getDriverByIdParam);

export default router;
