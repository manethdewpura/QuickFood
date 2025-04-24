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
// POST / - Request body should contain userId, message, and type
router.post('/', createNotification);

// Get all notifications for a specific user
// GET /user/:userId - Returns array of notifications sorted by creation date
router.get('/user/:userId', getNotifications);

// Update an existing notification
// PUT /:id - Request body can contain message, type, or read status
router.put('/:id', updateNotification);

// Mark a notification as read
// PATCH /:id/read - Updates only the read status to true
router.patch('/:id/read', markAsRead);

// Send order confirmation email
// POST /order-confirmation - Sends an email with order confirmation details
router.post('/order-confirmation', sendOrderConfirmation);

// Send delivery update email
// POST /delivery-update - Sends an email with delivery update details
router.post('/delivery-update', sendDeliveryUpdate);

export default router;
