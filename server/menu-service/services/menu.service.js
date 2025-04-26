import Menu from "../models/menu.model.js";
import mongoose from "mongoose";

// Create a new menu item
export const createMenuItem = async (menuData) => {
  try {
    const newMenuItem = new Menu(menuData);
    await newMenuItem.validate();
    return await newMenuItem.save();
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw new Error("Failed to create menu item.");
  }
};

// Get all menu items
export const getAllMenuItems = async () => {
  try {
    return await Menu.find().sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error fetching menu items:", error.message);
    throw new Error("Failed to fetch menu items.");
  }
};

// Get a menu item by ID
export const getMenuItemById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid menu item ID format.");
    }
    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      throw new Error("Menu item not found.");
    }
    return menuItem;
  } catch (error) {
    console.error("Error fetching menu item by ID:", error.message);
    throw new Error("Failed to fetch menu item by ID.");
  }
};

// Get menu items by restaurant ID
export const getMenuItemByRestaurantId = async (restaurantId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      throw new Error("Invalid restaurant ID format.");
    }
    return await Menu.find({ restaurantId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error fetching menu items by restaurant ID:", error.message);
    throw new Error("Failed to fetch menu items by restaurant ID.");
  }
};

// Get menu items by cuisine type
export const getMenuItemByCuisineType = async (cuisineType) => {
  try {
    return await Menu.find({ cuisineType }).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error fetching menu items by cuisine type:", error.message);
    throw new Error("Failed to fetch menu items by cuisine type.");
  }
};

// Get menu items by availability status
export const getMenuItemByAvailability = async (isAvailable) => {
  try {
    return await Menu.find({ isAvailable }).sort({ createdAt: -1 });
  } catch (error) {
    console.error(
      "Error fetching menu items by availability status:",
      error.message
    );
    throw new Error("Failed to fetch menu items by availability status.");
  }
};

// Update a menu item by ID
export const updateMenuItem = async (id, menuData) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid menu item ID format.");
    }
    const updatedMenuItem = await Menu.findByIdAndUpdate(id, menuData, {
      new: true,
      runValidators: true,
    });
    if (!updatedMenuItem) {
      throw new Error("Menu item not found.");
    }
    return updatedMenuItem;
  } catch (error) {
    console.error("Error updating menu item:", error.message);
    throw new Error("Failed to update menu item.");
  }
};

// Update a menu item by ID
export const updateMenuItemAvailability = async (id, isAvailable) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid menu item ID format.");
    }
    const updatedMenuItem = await Menu.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true, runValidators: true }
    );
    if (!updatedMenuItem) {
      throw new Error("Menu item not found.");
    }
    return updatedMenuItem;
  } catch (error) {
    console.error("Error updating menu item availability:", error.message);
    throw new Error("Failed to update menu item availability.");
  }
};

// Delete a menu item by ID
export const deleteMenuItem = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid menu item ID format.");
    }
    const deletedMenuItem = await Menu.findByIdAndDelete(id);
    if (!deletedMenuItem) {
      throw new Error("Menu item not found.");
    }
    return deletedMenuItem;
  } catch (error) {
    console.error("Error deleting menu item:", error.message);
    throw new Error("Failed to delete menu item.");
  }
};

// Get available menu items by restaurant ID
export const getAvailableMenuItemsByRestaurantId = async (restaurantId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      throw new Error("Invalid restaurant ID format.");
    }
    return await Menu.find({ restaurantId, isAvailable: true }).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error fetching available menu items by restaurant ID:", error.message);
    throw new Error("Failed to fetch available menu items by restaurant ID.");
  }
};

// Get menu items by cuisine type for a specific restaurant
export const getMenuItemsByCuisineTypeForRestaurant = async (restaurantId, cuisineType) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      throw new Error("Invalid restaurant ID format.");
    }
    return await Menu.find({ restaurantId, cuisineType }).sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error fetching menu items by cuisine type for restaurant:", error.message);
    throw new Error("Failed to fetch menu items by cuisine type for restaurant.");
  }
};
