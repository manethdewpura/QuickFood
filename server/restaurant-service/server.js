import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import restaurantRoutes from './routes/restaurant.routes.js';
import restaurantAllRoutes from './routes/restaurantAll.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI, { dbName: 'restaurant' })
  .then(() => console.log("Restaurant Service Connected to MongoDB"))
  .catch(err => console.log(err));
  
app.use('/restaurant', restaurantRoutes);
app.use('/restaurantAll', restaurantAllRoutes);
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

app.listen(5007, () => {
  console.log("Restaurant Service running on port 5007");
});
