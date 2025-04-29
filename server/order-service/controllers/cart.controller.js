import * as cartService from "../services/cart.service.js";

// Controller to handle adding items to cart
export const addToCart = async (req, res) => {
  try {
    const customerId = req.headers["x-user-id"];
    const { restaurantId, items } = req.body;
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

// Controller to fetch cart items
export const getCartItems = async (req, res) => {
  try {
    const customerId = req.headers["x-user-id"];
    const { restaurantId } = req.params;
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

// Controller to fetch all carts for a customer
export const getCartByCustomerId = async (req, res) => {
  try {
    const customerId = req.headers["x-user-id"];
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

// Controller to increase item quantity
export const increaseCartItemQuantity = async (req, res) => {
  try {
    const customerId = req.headers["x-user-id"];
    const { restaurantId, menuItemId } = req.params;
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

// Controller to decrease item quantity
export const decreaseCartItemQuantity = async (req, res) => {
  try {
    const customerId = req.headers["x-user-id"];
    const { restaurantId, menuItemId } = req.params;
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

// Controller to remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const customerId = req.headers["x-user-id"];
    const { restaurantId, menuItemId } = req.params;
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

// Controller to clear cart
export const clearCart = async (req, res) => {
  try {
    const customerId = req.headers["x-user-id"];
    const { restaurantId } = req.params;
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
