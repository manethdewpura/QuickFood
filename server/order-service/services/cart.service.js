import Cart from "../models/cart.model.js";
import mongoose from "mongoose";
import axios from "axios";

// Add an item to cart
export const addToCart = async (customerId, restaurantId, items) => {
  try {
    // Check if the cart already exists for the customer and restaurant
    let cart = await Cart.findOne({ customerId, restaurantId });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({ customerId, restaurantId, items: [] });
    }

    // Process each item in the items array
    for (const item of items) {
      const existingItemIndex = cart.items.findIndex(
        (cartItem) => cartItem.menuItemId.toString() === item.menuItemId
      );

      if (existingItemIndex > -1) {
        // Update the quantity if the item already exists in the cart
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Add a new item to the cart
        cart.items.push({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        });
      }
    }

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw new Error("Failed to add item to cart.");
  }
};

// Get cart items by customer ID and restaurant ID
export const getCartItems = async (customerId, restaurantId) => {
  try {
    const cart = await Cart.findOne({ customerId, restaurantId });
    if (!cart) return [];

    // Fetch menu item details for each cart item
    const cartItemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const response = await axios.get(
            `http://localhost:5003/menu/${item.menuItemId}`
          );
          const menuItem = response.data;
          return {
            menuItem: menuItem,
            quantity: item.quantity,
            menuItemId: item.menuItemId,
          };
        } catch (error) {
          console.error(`Error fetching menu item ${item.menuItemId}:`, error);
          return item;
        }
      })
    );

    return cartItemsWithDetails;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw new Error("Failed to fetch cart items.");
  }
};

// Get cart by customer ID
export const getCartByCustomerId = async (customerId) => {
  try {
    const carts = await Cart.find({ customerId });
    if (!carts || carts.length === 0) return [];

    // Process each cart and its items
    const cartsWithDetails = await Promise.all(
      carts.map(async (cart) => {
        // Fetch menu item details for each item in the cart
        const itemsWithDetails = await Promise.all(
          cart.items.map(async (item) => {
            try {
              const response = await axios.get(
                `http://localhost:5003/menu/${item.menuItemId}`
              );
              const menuItem = response.data;
              return {
                menuItem: menuItem,
                quantity: item.quantity,
                menuItemId: item.menuItemId,
              };
            } catch (error) {
              console.error(
                `Error fetching menu item ${item.menuItemId}:`,
                error
              );
              return item;
            }
          })
        );

        return {
          restaurantId: cart.restaurantId,
          items: itemsWithDetails,
        };
      })
    );

    return cartsWithDetails;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw new Error("Failed to fetch cart items.");
  }
};

// Increase the quantity of an item in the cart
export const increaseCartItemQuantity = async (
  customerId,
  restaurantId,
  menuItemId
) => {
  try {
    const cart = await Cart.findOne({ customerId, restaurantId });

    if (!cart) {
      throw new Error("Cart not found.");
    }

    // Find the item in the cart
    const item = cart.items.find(
      (cartItem) => cartItem.menuItemId.toString() === menuItemId
    );

    if (!item) {
      throw new Error("Item not found in cart.");
    }

    // Increment the quantity by 1
    item.quantity += 1;

    // Save the updated cart
    await cart.save();

    return cart;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw new Error("Failed to update item quantity in cart.");
  }
};

// Decrease the quantity of an item in the cart
export const decreaseCartItemQuantity = async (
  customerId,
  restaurantId,
  menuItemId
) => {
  try {
    const cart = await Cart.findOne({ customerId, restaurantId });

    if (!cart) {
      throw new Error("Cart not found.");
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (cartItem) => cartItem.menuItemId.toString() === menuItemId
    );

    if (itemIndex === -1) {
      throw new Error("Item not found in cart.");
    }

    // Decrement the quantity by 1
    cart.items[itemIndex].quantity -= 1;

    // If the quantity becomes 0, remove the item from the cart
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }

    // Save the updated cart
    await cart.save();

    return cart;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw new Error("Failed to update item quantity in cart.");
  }
};

// Remove an item from the cart
export const removeFromCart = async (customerId, restaurantId, menuItemId) => {
  try {
    const cart = await Cart.findOne({ customerId, restaurantId });

    if (!cart) {
      throw new Error("Cart not found.");
    }

    // Filter out the item to be removed
    cart.items = cart.items.filter(
      (item) => item.menuItemId.toString() !== menuItemId
    );

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw new Error("Failed to remove item from cart.");
  }
};

// Clear the cart
export const clearCart = async (customerId, restaurantId) => {
  try {
    const cart = await Cart.findOneAndDelete({ customerId, restaurantId });
    return cart ? cart : null;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw new Error("Failed to clear cart.");
  }
};
