import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import restaurantRoutes from './routes/restaurant.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, { dbName: 'restaurant' })
  .then(() => console.log("Restaurant Service Connected to MongoDB"))
  .catch(err => console.log(err));
  
app.use('/restaurant', restaurantRoutes);

app.listen(5007, () => {
  console.log("Restaurant Service running on port 5007");
});
