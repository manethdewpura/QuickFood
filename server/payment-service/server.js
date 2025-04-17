import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { dbName: 'payment' })
  .then(() => console.log("Payment Service Connected to MongoDB"))
  .catch(err => console.log(err));

app.use('/payment', paymentRoutes);

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

app.listen(5006, () => {
  console.log("Payment Service running on port 5006");
});
