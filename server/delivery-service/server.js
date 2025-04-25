import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import deliveryRoutes from './routes/delivery.routes.js';
import driverRoutes from './routes/driver.routes.js';
import { initializeSocket } from './socket.js';

dotenv.config();

const app = express();

// Configure CORS middleware
app.use(cors({
  origin: 'http://localhost:3005',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Socket.IO with the Express app
const server = initializeSocket(app);

mongoose.connect(process.env.MONGO_URI, { dbName: 'delivery' })
  .then(() => console.log("Delivery Service Connected to MongoDB"))
  .catch(err => console.log(err));

app.use('/delivery', deliveryRoutes);
app.use('/driver', driverRoutes);

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Delivery Service running on port ${PORT}`);
});
