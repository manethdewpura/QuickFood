import express from 'express';
import { createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant, updateAvailability } from '../controllers/restaurant.controller.js';

const router = express.Router();

router.post('/', createRestaurant); // Create a new restaurant
router.get('/', getAllRestaurants); // Get all restaurants
router.get('/:id', getRestaurantById); // Get a restaurant by ID    
router.put('/:id', updateRestaurant); // Update restaurant details by ID
router.delete('/:id', deleteRestaurant); // Delete a restaurant by ID
router.patch('/:id/availability', updateAvailability); // Update restaurant availability by ID

export default router;