import express from "express";
import {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  getMenuItemByRestaurantId,
  getMenuItemByCuisineType,
  getMenuItemByAvailability,
  updateMenuItem,
  updateMenuItemAvailability,
  deleteMenuItem,
} from "../controllers/menu.controller.js";

const router = express.Router();

router.post("/", createMenuItem); // Create a new menu item
router.get("/", getAllMenuItems); // Get all menu items
router.get("/:id", getMenuItemById); // Get a menu item by ID
router.get("/restaurant/:restaurantId", getMenuItemByRestaurantId); // Get menu items by restaurant ID
router.get("/cuisine/:cuisineType", getMenuItemByCuisineType); // Get menu items by cuisine type
router.get("/availability/:isAvailable", getMenuItemByAvailability); // Get menu items by availability status
router.put("/:id", updateMenuItem); // Update a menu item by ID
router.patch("/:id/availability", updateMenuItemAvailability); // Update a menu item by ID
router.delete("/:id", deleteMenuItem); // Delete a menu item by ID

export default router;
