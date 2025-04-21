import express from "express";
import {
  createMenuItem,
  updateMenuItem,
  updateMenuItemAvailability,
  deleteMenuItem,
} from "../controllers/menu.controller.js";

const router = express.Router();

router.post("/", createMenuItem); // Create a new menu item
router.put("/:id", updateMenuItem); // Update a menu item by ID
router.patch("/:id/availability", updateMenuItemAvailability); // Update a menu item by ID
router.delete("/:id", deleteMenuItem); // Delete a menu item by ID

export default router;
