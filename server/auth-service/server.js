import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import { services, limiterConfigs } from "./config/services.js";
import { CircuitBreaker } from "./utils/circuitBreaker.js";
import { createProxyConfig } from "./utils/proxyConfig.js";
import authRoutes from "./routes/auth.routes.js";
import { authenticate, authorizeRole } from "./middleware/auth.middleware.js";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  if (!req.url.startsWith("/auth")) {
    next();
    return;
  }
  express.json()(req, res, next);
});

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

const proxyTimeout = 30000;

services.forEach(({ route, target, middleware = [] }) => {
  const limiterConfig = limiterConfigs[route] || limiterConfigs.default;
  app.use(route, rateLimit(limiterConfig));

  if (middleware.includes("authenticate")) {
    app.use(route, authenticate);
  }

  const roleMiddleware = middleware.find(
    (m) => typeof m === "object" && m.authorizeRole
  );
  if (roleMiddleware) {
    app.use(route, authorizeRole(...roleMiddleware.authorizeRole));
  }

  app.use(
    route,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^${route}`]: "" },
      onProxyReq: (proxyReq, req, res) => {
        if (
          req.body &&
          (req.method === "POST" ||
            req.method === "PUT" ||
            req.method === "PATCH")
        ) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
      onError: (err, req, res) => {
        console.error(`Proxy error for ${route}:`, err);
        res.status(503).send("Service Unavailable");
      },
    })
  );
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

mongoose
  .connect(process.env.MONGO_URI, { dbName: "auth" })
  .then(() => console.log("Auth Service Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/auth", authRoutes);

app.listen(5000, () => {
  console.log("Auth Service running on port 5000");
});
