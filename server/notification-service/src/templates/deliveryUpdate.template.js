export const deliveryUpdateTemplate = (name, orderId, status) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Delivery Update</title>
            <style>
                body {
                    font-family: 'Segoe UI', Arial, sans-serif;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 40px 20px;
                    line-height: 1.6;
                }
                .container {
                    max-width: 600px;
                    margin: auto;
                    background: #ffffff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                }
                .logo {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo img {
                    height: 60px;
                }
                h1 {
                    color: #2d3748;
                    text-align: center;
                    font-size: 28px;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 15px;
                }
                p {
                    color: #4a5568;
                    font-size: 16px;
                    margin: 16px 0;
                }
                .status-box {
                    background: #f7fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 20px 0;
                    text-align: center;
                    font-size: 18px;
                    color: #2d3748;
                }
                .status {
                    font-weight: 600;
                    color: #4299e1;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #f0f0f0;
                    font-size: 14px;
                    color: #718096;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">
                    <!-- Replace with your logo -->
                    <h2 style="color: #4a5568; margin: 0;">QuickFood</h2>
                </div>
                <h1>Delivery Update</h1>
                <p>Dear ${name},</p>
                <div class="status-box">
                    Order ID: ${orderId}<br>
                    Status: <span class="status">${status}</span>
                </div>
                <p>We wanted to let you know that your order status has been updated. We're committed to providing you with the best possible service.</p>
                <p>Thank you for choosing QuickFood!</p>
                <div class="footer">
                    <p>© 2024 QuickFood. All rights reserved.</p>
                    <p>If you have any questions, please contact our support team.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};
