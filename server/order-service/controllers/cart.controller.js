import * as cartService from "../services/cart.service.js";

// Add an item to the cart
export const addToCart = async (req, res) => {
  try {
    const { customerId, restaurantId, items } = req.body;
    const cart = await cartService.addToCart(customerId, restaurantId, items);
    res.status(200).json({
      success: true,
      message: "Item added to cart successfully.",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get cart items by customer ID and restaurant ID
export const getCartItems = async (req, res) => {
  try {
    const { customerId, restaurantId } = req.params;
    const cartItems = await cartService.getCartItems(customerId, restaurantId);
    res.status(200).json({
      success: true,
      message: "Cart items fetched successfully.",
      data: cartItems,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get cart by customer ID
export const getCartByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    const cartItems = await cartService.getCartByCustomerId(customerId);
    res.status(200).json({
      success: true,
      message: "Cart items fetched successfully.",
      data: cartItems,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Increase the quantity of an item in the cart
export const increaseCartItemQuantity = async (req, res) => {
  try {
    const { customerId, restaurantId, menuItemId } = req.params;
    const cart = await cartService.increaseCartItemQuantity(
      customerId,
      restaurantId,
      menuItemId
    );
    res.status(200).json({
      success: true,
      message: "Item quantity increased successfully.",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Decrease the quantity of an item in the cart
export const decreaseCartItemQuantity = async (req, res) => {
  try {
    const { customerId, restaurantId, menuItemId } = req.params;
    const cart = await cartService.decreaseCartItemQuantity(
      customerId,
      restaurantId,
      menuItemId
    );
    res.status(200).json({
      success: true,
      message: "Item quantity decreased successfully.",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Remove an item from the cart
export const removeFromCart = async (req, res) => {
  try {
    const { customerId, restaurantId, menuItemId } = req.params;
    const cart = await cartService.removeFromCart(
      customerId,
      restaurantId,
      menuItemId
    );
    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully.",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Clear the cart
export const clearCart = async (req, res) => {
  try {
    const { customerId, restaurantId } = req.params;
    const cart = await cartService.clearCart(customerId, restaurantId);
    res.status(200).json({
      success: true,
      message: "Cart cleared successfully.",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
