import nodemailer from "nodemailer";
import { orderConfirmTemplate } from "../templates/orderConfirm.template.js";
import { deliveryUpdateTemplate } from "../templates/deliveryUpdate.template.js";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderConfirmationEmail = async (email, name, orderId) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Order Confirmation",
      html: orderConfirmTemplate(name, orderId),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
};

export const sendDeliveryUpdateEmail = async (email, name, orderId, status) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Delivery Update",
      html: deliveryUpdateTemplate(name, orderId, status),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending delivery update email:", error);
    throw error;
  }
};
