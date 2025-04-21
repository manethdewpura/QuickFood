import express from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register); // Register a new user
router.post('/login', login); // Login a user

export default router;