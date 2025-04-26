import express from 'express';
import { register, login, getUser, updateUser, deleteUser, getAllUsers } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register); // Register a new user
router.post('/login', login); // Login a user
router.get('/user', getUser); // Get user details 
router.put('/user', updateUser); // Update user details
router.delete('/user', deleteUser); // Delete user account
router.get('/all', getAllUsers); // Get all users

export default router;