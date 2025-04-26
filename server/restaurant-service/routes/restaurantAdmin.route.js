import express from 'express';
import { getAllRestaurants, updateVerification } from '../services/restaurant.service.js';

const router = express.Router();

router.get('/all', getAllRestaurants); // Get all restaurants
router.put('/verify/:id', updateVerification); // Update restaurant verification status by ID

export default router;