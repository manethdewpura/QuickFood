import { Router } from "express";
import { 
    createNotification, 
    getNotifications, 
    updateNotification, 
    markAsRead,
    sendOrderConfirmation,
    sendDeliveryUpdate
} from "../controllers/notification.controller.js";

// Initialize Express Router
const router = Router();

// Create a new notification
router.post('/', createNotification);

// Get all notifications for a specific user
router.get('/user/:userId', getNotifications);

// Update an existing notification
router.put('/:id', updateNotification);

// Mark a notification as read
router.patch('/:id/read', markAsRead);

// Send order confirmation email
router.post('/order-confirmation', sendOrderConfirmation);

// Send delivery update email
router.post('/delivery-update', sendDeliveryUpdate);

export default router;
