import express from "express";
import {
  getAllMenuItems,
  getMenuItemById,
  getMenuItemByRestaurantId,
  getMenuItemByCuisineType,
  getMenuItemByAvailability,
} from "../controllers/menu.controller.js";

const router = express.Router();

router.get("/", getAllMenuItems); // Get all menu items
router.get("/:id", getMenuItemById); // Get a menu item by ID
router.get("/restaurant/:restaurantId", getMenuItemByRestaurantId); // Get menu items by restaurant ID
router.get("/cuisine/:cuisineType", getMenuItemByCuisineType); // Get menu items by cuisine type
router.get("/availability/:isAvailable", getMenuItemByAvailability); // Get menu items by availability status

export default router;
