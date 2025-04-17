import crypto from "crypto";

export const generateHash = (order_id, amount, currency) => {
    try {
        console.log("Payment Service - Generating hash...");
        const merchantSecret = process.env.APP_SECRET_PAYHERE;
        const merchantId = process.env.APP_ID_PAYHERE;

        if (!merchantSecret) {
            throw new Error("Environment variable APP_SECRET_PAYHERE is not defined.");
        }
        if (!merchantId) {
            throw new Error("Environment variable APP_ID_PAYHERE is not defined.");
        }

        const hashedSecret = crypto
            .createHash("md5")
            .update(merchantSecret)
            .digest("hex")
            .toUpperCase();

        if (isNaN(amount) || amount === undefined || amount === null) {
            throw new Error("Invalid amount provided");
        }

        const amountFormatted = parseFloat(amount).toFixed(2);

        const hash = crypto
            .createHash("md5")
            .update(merchantId + order_id + amountFormatted + currency + hashedSecret)
            .digest("hex")
            .toUpperCase();

        return hash;
    } catch (error) {
        console.error("Error generating hash:", error.message);
        throw error;
    }
};

export const handleNotification = () => {
    try {
        const merchantSecret = process.env.APP_SECRET_PAYHERE;
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
