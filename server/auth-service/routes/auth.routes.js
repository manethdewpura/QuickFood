import express from 'express';
import { register, login, getUser, updateUser, deleteUser, getAllUsers } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticate, getUser);
router.put('/user', authenticate, updateUser);
router.delete('/user', authenticate, deleteUser);
router.get('/all', authenticate, getAllUsers);

export default router;