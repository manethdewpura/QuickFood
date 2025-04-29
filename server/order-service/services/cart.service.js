import Cart from "../models/cart.model.js";
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Service to add items to customer's cart
export const addToCart = async (customerId, restaurantId, items) => {
  try {
    let cart = await Cart.findOne({ customerId, restaurantId });
    if (!cart) {
      cart = new Cart({ customerId, restaurantId, items: [] });
    }
    for (const item of items) {
      const existingItemIndex = cart.items.findIndex(
        (cartItem) => cartItem.menuItemId.toString() === item.menuItemId
      );
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
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

// Service to retrieve cart items with menu details
export const getCartItems = async (customerId, restaurantId) => {
  try {
    const cart = await Cart.findOne({ customerId, restaurantId });
    if (!cart) return [];
    const restaurantResponse = await axios.get(
      `${process.env.RESTAURANT_SERVICE_URL}restaurantAll/${restaurantId}`
    );
    const restaurantDetails = restaurantResponse.data;
    const cartItemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        try {
          const response = await axios.get(
            `${process.env.MENU_SERVICE_URL}menu/${item.menuItemId}`
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
    return {
      restaurant: restaurantDetails,
      items: cartItemsWithDetails,
    };
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw new Error("Failed to fetch cart items.");
  }
};

// Service to get all cart items for a customer across restaurants
export const getCartByCustomerId = async (customerId) => {
  try {
    const carts = await Cart.find({ customerId });
    if (!carts || carts.length === 0) return [];
    const cartsWithDetails = await Promise.all(
      carts.map(async (cart) => {
        const restaurantResponse = await axios.get(
          `${process.env.RESTAURANT_SERVICE_URL}restaurantAll/${cart.restaurantId}`
        );
        const restaurantDetails = restaurantResponse.data;
        const itemsWithDetails = await Promise.all(
          cart.items.map(async (item) => {
            try {
              const response = await axios.get(
                `${process.env.MENU_SERVICE_URL}menu/${item.menuItemId}`
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
          restaurant: restaurantDetails,
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

// Service to increment item quantity in cart
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
    const item = cart.items.find(
      (cartItem) => cartItem.menuItemId.toString() === menuItemId
    );
    if (!item) {
      throw new Error("Item not found in cart.");
    }
    item.quantity += 1;
    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw new Error("Failed to update item quantity in cart.");
  }
};

// Service to decrement item quantity in cart
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
    const itemIndex = cart.items.findIndex(
      (cartItem) => cartItem.menuItemId.toString() === menuItemId
    );
    if (itemIndex === -1) {
      throw new Error("Item not found in cart.");
    }
    cart.items[itemIndex].quantity -= 1;
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }

    if (cart.items.length === 0) {
      await Cart.findOneAndDelete({ customerId, restaurantId });
      return null;
    }

    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw new Error("Failed to update item quantity in cart.");
  }
};

// Service to remove specific item from cart
export const removeFromCart = async (customerId, restaurantId, menuItemId) => {
  try {
    const cart = await Cart.findOne({ customerId, restaurantId });
    if (!cart) {
      throw new Error("Cart not found.");
    }
    cart.items = cart.items.filter(
      (item) => item.menuItemId.toString() !== menuItemId
    );
    
    if (cart.items.length === 0) {
      await Cart.findOneAndDelete({ customerId, restaurantId });
      return null;
    }
    
    await cart.save();
    return cart;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw new Error("Failed to remove item from cart.");
  }
};

// Service to clear entire cart for a customer at a restaurant
export const clearCart = async (customerId, restaurantId) => {
  try {
    const cart = await Cart.findOneAndDelete({ customerId, restaurantId });
    return cart ? cart : null;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw new Error("Failed to clear cart.");
  }
};
