import express from 'express';
import { register, login, getUser, updateUser, deleteUser, getAllUsers } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register); // Register a new user
router.post('/login', login); // Login a user
router.get('/user', authenticate, getUser); // Get user details by ID
router.put('/user', authenticate, updateUser); // Update user details by ID
router.delete('/user', authenticate, deleteUser); // Delete user by ID
router.get('/all', authenticate, getAllUsers); // Get all users
router.get('/user/other', getUser); // Get other user details by ID
router.put('/user/admin', updateUser); // Update user details by ID
router.delete('/user/admin', deleteUser); // Delete user by ID
export default router;