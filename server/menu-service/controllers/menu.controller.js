import e from 'express';
import * as menuService from '../services/menu.service.js';

// Create a new menu item
export const createMenuItem = async (req, res) => {
  try {
    const menuItem = await menuService.createMenuItem(req.body);
    res.status(201).json({
      success: true,
      message: 'Menu item created successfully.',
      data: menuItem,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await menuService.getAllMenuItems();
    res.status(200).json({
      success: true,
      message: 'Menu items fetched successfully.',
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a menu item by ID
export const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await menuService.getMenuItemById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Menu item fetched successfully.',
      data: menuItem,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Get menu items by restaurant ID
export const getMenuItemByRestaurantId = async (req, res) => {
  try {
    const menuItems = await menuService.getMenuItemByRestaurantId(req.params.restaurantId);
    res.status(200).json({
      success: true,
      message: 'Menu items fetched successfully.',
      data: menuItems,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Get menu items by cuisine type
export const getMenuItemByCuisineType = async (req, res) => {
  try {
    const menuItems = await menuService.getMenuItemByCuisineType(req.params.cuisineType);
    res.status(200).json({
      success: true,
      message: 'Menu items fetched successfully.',
      data: menuItems,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Get menu items by availability status
export const getMenuItemByAvailability = async (req, res) => {
  try {
    const menuItems = await menuService.getMenuItemByAvailability(req.params.isAvailable);
    res.status(200).json({
      success: true,
      message: 'Menu items fetched successfully.',
      data: menuItems,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// Update a menu item by ID
export const updateMenuItem = async (req, res) => {
  try {
    const updatedMenuItem = await menuService.updateMenuItem(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully.',
      data: updatedMenuItem,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update menu item availability by ID
export const updateMenuItemAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const updatedMenuItem = await menuService.updateMenuItemAvailability(req.params.id, isAvailable);
    res.status(200).json({
      success: true,
      message: 'Menu item availability updated successfully.',
      data: updatedMenuItem,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a menu item by ID
export const deleteMenuItem = async (req, res) => {
  try {
    const deletedMenuItem = await menuService.deleteMenuItem(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully.',
      data: deletedMenuItem,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};