import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import { services, limiterConfigs } from "./config/services.js";
import { CircuitBreaker } from "./utils/circuitBreaker.js";
import { createProxyConfig } from "./utils/proxyConfig.js";

dotenv.config();

const app = express();

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

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});
