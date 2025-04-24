import crypto from "crypto";
import axios from "axios";

const createOrder = async (orderData) => {
    try {
        const response = await axios.get('http://localhost:5005/orders/', orderData);
        return response.data.data;
    } catch (error) {
        console.error("Error creating order:", error.message);
        throw new Error("Failed to create order");
    }
};

export const generateHash = async (orderData, currency) => {
    try {
        console.log("Payment Service - Creating order and generating hash...");
        const merchantSecret = process.env.MERCHANT_SECRET_PAYHERE;
        const merchantId = process.env.MERCHANT_ID_PAYHERE;

        if (!merchantSecret || !merchantId) {
            throw new Error("Missing merchant configuration");
        }

        // Create order first
        const order = await createOrder(orderData);
        const { _id: orderId, totalAmount } = order;

        const hashedSecret = crypto
            .createHash("md5")
            .update(merchantSecret)
            .digest("hex")
            .toUpperCase();

        const amountFormatted = parseFloat(totalAmount).toFixed(2);

        const hash = crypto
            .createHash("md5")
            .update(merchantId + orderId + amountFormatted + currency + hashedSecret)
            .digest("hex")
            .toUpperCase();

        return { hash, orderId, totalAmount };
    } catch (error) {
        console.error("Error in payment service:", error.message);
        throw error;
    }
};

export const handleNotification = () => {
    try {
        const merchantSecret = process.env.MERCHANT_SECRET_PAYHERE;
        const localMd5sig = crypto
            .createHash("md5")
            .update(
                merchant_id +
                    order_id +
                    payhere_amount +
                    payhere_currency +
                    status_code +
                    crypto
                        .createHash("md5")
                        .update(merchantSecret)
                        .digest("hex")
                        .toUpperCase()
            )
            .digest("hex")
            .toUpperCase();

        if (localMd5sig === md5sig && status_code === "2") {
            console.log("Payment successful for order:", order_id);
        } else {
            console.log("Payment verification failed for order:", order_id);
        }
    } catch (error) {
        console.error("Error handling payment notification:", error.message);
        throw error;
    }
};
