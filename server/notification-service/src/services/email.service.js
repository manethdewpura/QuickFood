import nodemailer from "nodemailer";
import { orderConfirmTemplate } from "../templates/orderConfirm.template.js";
import dotenv from "dotenv";
dotenv.config();

// Configure email transport settings
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send order confirmation email to customer
export const sendOrderConfirmationEmail = async (email, name, orderId, orderDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Order Confirmation",
      html: orderConfirmTemplate(name, orderId, orderDetails),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
};
