import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import menuRoutes from "./routes/menu.routes.js";
import menuResRoutes from "./routes/menuRes.routes.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "menu" })
  .then(() => console.log("Menu Service Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/menu", menuRoutes);
app.use("/menuRes", menuResRoutes);

app.listen(5003, () => {
  console.log("Menu Service running on port 5003");
});
