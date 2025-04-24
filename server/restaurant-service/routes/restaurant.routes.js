import express from 'express';
import { createRestaurant, updateRestaurant, deleteRestaurant, updateAvailability, getRestaurantsByUserId } from '../controllers/restaurant.controller.js';
const router = express.Router();

router.post('/', createRestaurant) // Create a new restaurant  
router.put('/:id', updateRestaurant); // Update restaurant details by ID
router.delete('/:id', deleteRestaurant); // Delete a restaurant by ID
router.patch('/:id/availability', updateAvailability); // Update restaurant availability by ID
router.get('/user', getRestaurantsByUserId); // Get restaurant by user ID

export default router;