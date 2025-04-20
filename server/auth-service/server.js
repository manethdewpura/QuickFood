import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import { services, limiterConfigs } from "./config/services.js";
import { CircuitBreaker } from "./utils/circuitBreaker.js";
import { createProxyConfig } from "./utils/proxyConfig.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("combined"));

const defaultLimiter = rateLimit(limiterConfigs.default);
app.use(defaultLimiter);

const circuitBreaker = new CircuitBreaker(services);

services.forEach(({ route, target }) => {
  const limiterConfig = limiterConfigs[route] || limiterConfigs.default;
  app.use(route, rateLimit(limiterConfig));

  app.use(
    route,
    createProxyMiddleware(createProxyConfig(route, target, circuitBreaker))
  );
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

mongoose.connect(process.env.MONGO_URI, { dbName: 'auth' })
  .then(() => console.log("Auth Service Connected to MongoDB"))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Auth Service running on port 5000");
});
