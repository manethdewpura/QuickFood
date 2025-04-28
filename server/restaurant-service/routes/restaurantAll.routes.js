import express from "express";
import {
  getAllVerifiedRestaurants,
  getNearestRestaurants,
  getRestaurantById,
  searchRestaurants,
  getRestaurantAdminId, // Add this import
} from "../controllers/restaurant.controller.js";

const router = express.Router();

router.get("/search", searchRestaurants); // Add search endpoint
router.get("/nearest", getNearestRestaurants); // Get nearest restaurants
router.get("/", getAllVerifiedRestaurants); // Get all verified restaurants
router.get("/:id", getRestaurantById); // Get a restaurant by ID
router.get("/admin/:id", getRestaurantAdminId); // Add this new route

export default router;
