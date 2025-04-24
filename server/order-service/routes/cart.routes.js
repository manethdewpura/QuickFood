import express from "express";
import {
  addToCart,
  getCartItems,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartByCustomerId,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add", addToCart); // Add an item to the cart
router.get("/customer/:customerId", getCartByCustomerId); // Get cart by customer ID
router.get("/:customerId/:restaurantId", getCartItems); // Get cart items by customer ID and restaurant ID
router.patch(
  "/increase/:customerId/:restaurantId/:menuItemId",
  increaseCartItemQuantity
); // Increase the quantity of an item in the cart
router.patch(
  "/decrease/:customerId/:restaurantId/:menuItemId",
  decreaseCartItemQuantity
); // Decrease the quantity of an item in the cart
router.delete("/remove/:customerId/:restaurantId/:menuItemId", removeFromCart); // Remove an item from the cart
router.delete("/clear/:customerId/:restaurantId", clearCart); // Clear the cart

export default router;
