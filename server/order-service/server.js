import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, { dbName: 'order' })
  .then(() => console.log("Order Service Connected to MongoDB"))
  .catch(err => console.log(err));

app.listen(5005, () => {
  console.log("Order Service running on port 5005");
});
