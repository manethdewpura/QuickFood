import express from 'express';
import { getAllRestaurants, getNearestRestaurants, getRestaurantById } from '../controllers/restaurant.controller.js';

const router = express.Router();

router.get('/', getAllRestaurants); // Get all restaurants
router.get('/nearest', getNearestRestaurants); // Get nearest restaurants
router.get('/:id', getRestaurantById); // Get a restaurant by ID 

export default router;