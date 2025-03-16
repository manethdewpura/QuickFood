import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Proxy requests to microservices
app.use("/auth", createProxyMiddleware({ target: "http://localhost:5001", changeOrigin: true }));
app.use("/delivery", createProxyMiddleware({ target: "http://localhost:5002", changeOrigin: true }));
app.use("/menu", createProxyMiddleware({ target: "http://localhost:5003", changeOrigin: true }));
app.use("/notification", createProxyMiddleware({ target: "http://localhost:5004", changeOrigin: true }));
app.use("/order", createProxyMiddleware({ target: "http://localhost:5005", changeOrigin: true }));
app.use("/payment", createProxyMiddleware({ target: "http://localhost:5006", changeOrigin: true }));
app.use("/restaurant", createProxyMiddleware({ target: "http://localhost:5007", changeOrigin: true }));

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});
