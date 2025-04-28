export const orderConfirmTemplate = (name, orderId, orderDetails) => {
  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const itemsList = orderDetails.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${
        item.menuItemName
      }</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${
        item.quantity
      }</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${formatPrice(
        item.price * item.quantity,
        orderDetails.currency
      )}</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Confirmation</title>
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
            .order-id {
                background: #f7fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                text-align: center;
                font-size: 18px;
                color: #2d3748;
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
                <h2 style="color: #4a5568; margin: 0;">QuickFood</h2>
            </div>
            <h1>Order Confirmation</h1>
            <p>Dear ${name},</p>
            <p>Thank you for ordering with QuickFood! We're excited to confirm your order.</p>
            
            <div class="order-id">
                Order ID: ${orderId}
            </div>

            <div class="order-details" style="margin: 20px 0;">
                <h3 style="color: #2d3748;">Order Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f7fafc;">
                            <th style="padding: 8px; text-align: left;">Item</th>
                            <th style="padding: 8px; text-align: left;">Quantity</th>
                            <th style="padding: 8px; text-align: left;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                      ${itemsList}
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Delivery Fee</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">1</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${formatPrice(
                          500,
                          orderDetails.currency
                        )}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                        <tr style="background-color: #f7fafc;">
                            <td colspan="2" style="padding: 8px; font-weight: bold;">Total:</td>
                            <td style="padding: 8px;">${formatPrice(
                              orderDetails.totalAmount,
                              orderDetails.currency
                            )}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="delivery-address" style="margin: 20px 0; padding: 15px; background-color: #f7fafc; border-radius: 8px;">
                <h3 style="color: #2d3748; margin-top: 0;">Delivery Address:</h3>
                <p style="margin: 0;">${orderDetails.deliveryAddress}</p>
            </div>

            <p>Your order has been successfully placed and is being processed. We'll notify you once it's ready.</p>
            <p>We appreciate your business and hope you enjoy your meal!</p>
            
            <div class="footer">
                <p>© 2025 QuickFood. All rights reserved.</p>
                <p>If you have any questions, please contact our support team.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
