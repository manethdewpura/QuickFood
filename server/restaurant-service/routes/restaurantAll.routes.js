import express from 'express';
import { getAllVerifiedRestaurants, getNearestRestaurants, getRestaurantById } from '../controllers/restaurant.controller.js';

const router = express.Router();

router.get('/nearest', getNearestRestaurants); // Get nearest restaurants
router.get('/', getAllVerifiedRestaurants); // Get all verified restaurants
router.get('/:id', getRestaurantById); // Get a restaurant by ID 

export default router;
