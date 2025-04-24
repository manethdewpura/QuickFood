import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import notificationRoutes from './src/routes/notification.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/notifications', notificationRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI, { dbName: 'notification' })
  .then(() => console.log("Notification Service Connected to MongoDB"))
  .catch(err => console.log(err));

app.listen(5004, () => {
  console.log("Notification Service running on port 5004");
});
