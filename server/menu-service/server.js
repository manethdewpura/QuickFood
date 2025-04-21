import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import menuRoutes from './routes/menu.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, { dbName: 'menu' })
  .then(() => console.log("Menu Service Connected to MongoDB"))
  .catch(err => console.log(err));

app.use('/menu', menuRoutes);

app.listen(5003, () => {
  console.log("Menu Service running on port 5003");
});
