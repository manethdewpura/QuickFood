import express from 'express';
import { generateHashController, handleNotificationController, testController } from '../controllers/payment.controller.js';

const router = express.Router();
router.post('/', generateHashController);
router.post('/notify', handleNotificationController);

export default router;
