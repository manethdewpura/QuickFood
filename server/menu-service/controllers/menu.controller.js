import * as menuService from "../services/menu.service.js";

// Handle new menu item creation
export const createMenuItem = async (req, res) => {
  try {
    const menuItem = await menuService.createMenuItem(req.body);
    res.status(201).json({
      success: true,
      message: "Menu item created successfully.",
      data: menuItem,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Retrieve all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await menuService.getAllMenuItems();
    res.status(200).json({
      success: true,
      message: "Menu items fetched successfully.",
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single menu item details
export const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await menuService.getMenuItemById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Menu item fetched successfully.",
      data: menuItem,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Get restaurant's menu items
export const getMenuItemByRestaurantId = async (req, res) => {
  try {
    const menuItems = await menuService.getMenuItemByRestaurantId(
      req.params.restaurantId
    );
    res.status(200).json({
      success: true,
      message: "Menu items fetched successfully.",
      data: menuItems,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Get items by cuisine category
export const getMenuItemByCuisineType = async (req, res) => {
  try {
    const menuItems = await menuService.getMenuItemByCuisineType(
      req.params.cuisineType
    );
    res.status(200).json({
      success: true,
      message: "Menu items fetched successfully.",
      data: menuItems,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Filter items by availability
export const getMenuItemByAvailability = async (req, res) => {
  try {
    const menuItems = await menuService.getMenuItemByAvailability(
      req.params.isAvailable
    );
    res.status(200).json({
      success: true,
      message: "Menu items fetched successfully.",
      data: menuItems,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Update menu item details
export const updateMenuItem = async (req, res) => {
  try {
    const updatedMenuItem = await menuService.updateMenuItem(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Menu item updated successfully.",
      data: updatedMenuItem,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Toggle item availability
export const updateMenuItemAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const updatedMenuItem = await menuService.updateMenuItemAvailability(
      req.params.id,
      isAvailable
    );
    res.status(200).json({
      success: true,
      message: "Menu item availability updated successfully.",
      data: updatedMenuItem,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Remove menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const deletedMenuItem = await menuService.deleteMenuItem(req.params.id);
    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully.",
      data: deletedMenuItem,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Get restaurant's available items
export const getAvailableMenuItemsByRestaurantId = async (req, res) => {
  try {
    const menuItems = await menuService.getAvailableMenuItemsByRestaurantId(
      req.params.restaurantId
    );
    res.status(200).json({
      success: true,
      message: "Menu items by restaurant id fetched successfully.",
      data: menuItems,
    });
  } catch (error) {
    console.error(
      "Error fetching available menu items by restaurant ID:",
      error
    );
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get restaurant items by cuisine
export const getMenuItemsByCuisineTypeForRestaurant = async (req, res) => {
  const { restaurantId, cuisineType } = req.params;

  try {
    const menuItems = await menuService.getMenuItemsByCuisineTypeForRestaurant(
      restaurantId,
      cuisineType
    );
    res.status(200).json({
      success: true,
      message:
        "Menu items by cuisine type for the restaurant fetched successfully.",
      data: menuItems,
    });
  } catch (error) {
    console.error(
      "Error fetching menu items by cuisine type for restaurant:",
      error
    );
    res.status(500).json({ success: false, message: error.message });
  }
};
