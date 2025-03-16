import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Payment Service Connected to MongoDB"))
  .catch(err => console.log(err));


app.listen(5006, () => {
  console.log("Payment Service running on port 5006");
});
