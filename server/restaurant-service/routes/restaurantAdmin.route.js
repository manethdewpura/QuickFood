import express from 'express';
import { getAllRestaurants } from '../services/restaurant.service.js';

const router = express.Router();

router.get('/all', getAllRestaurants); // Get all restaurants

export default router;