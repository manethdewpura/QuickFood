import express from "express";
import {
  getAllMenuItems,
  getMenuItemById,
  getMenuItemByRestaurantId,
  getMenuItemByCuisineType,
  getMenuItemByAvailability,
  getAvailableMenuItemsByRestaurantId,
  getMenuItemsByCuisineTypeForRestaurant,
} from "../controllers/menu.controller.js";

const router = express.Router();

router.get("/", getAllMenuItems); // Get all menu items
router.get("/:id", getMenuItemById); // Get a menu item by ID
router.get("/restaurant/:restaurantId", getMenuItemByRestaurantId); // Get menu items by restaurant ID
router.get("/cuisine/:cuisineType", getMenuItemByCuisineType); // Get menu items by cuisine type
router.get("/availability/:isAvailable", getMenuItemByAvailability); // Get menu items by availability status
router.get(
  "/restaurant/:restaurantId/available",
  getAvailableMenuItemsByRestaurantId
); // Get available menu items by restaurant ID
router.get(
  "/restaurant/:restaurantId/cuisine/:cuisineType",
  getMenuItemsByCuisineTypeForRestaurant
); // Get menu items by cuisine type for a specific restaurant

export default router;
