import express from 'express';
import { getAllRestaurants, updateVerification } from '../controllers/restaurant.controller.js';

const router = express.Router();

router.get('/all', getAllRestaurants); // Get all restaurants
router.put('/verify/:id', updateVerification); // Update restaurant verification status by ID

export default router;