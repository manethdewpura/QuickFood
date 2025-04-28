import dotenv from "dotenv";
dotenv.config();

export const services = [
  {
    route: "/delivery",
    target: process.env.DELIVERY_SERVICE_URL + "delivery",
    middleware: [
      "authenticate",
      { authorizeRole: ["DeliveryPersonnel", "Customer", "RestaurantAdmin"] },
    ],
  },
  {
    route: "/driver",
    target: process.env.DELIVERY_SERVICE_URL + "driver",
    middleware: [
      "authenticate",
      { authorizeRole: ["DeliveryPersonnel", "Customer", "RestaurantAdmin"] },
    ],
  },
  {
    route: "/menuRes",
    target: process.env.MENU_SERVICE_URL + "menuRes",
    middleware: [
      "authenticate",
      { authorizeRole: ["SystemAdmin", "RestaurantAdmin"] },
    ],
  },
  {
    route: "/menu",
    target: process.env.MENU_SERVICE_URL + "menu",
    middleware: ["authenticate"],
  },
  {
    route: "/notifications",
    target: process.env.NOTIFICATION_SERVICE_URL + "notifications",
    middleware: ["authenticate"],
  },
  {
    route: "/cart",
    target: process.env.ORDER_SERVICE_URL + "cart",
    middleware: ["authenticate"],
  },
  {
    route: "/order",
    target: process.env.ORDER_SERVICE_URL + "order",
    middleware: ["authenticate"],
  },
  {
    route: "/payment",
    target: process.env.PAYMENT_SERVICE_URL + "payment",
    middleware: ["authenticate"],
  },
  {
    route: "/restaurant",
    target: process.env.RESTAURANT_SERVICE_URL + "restaurant",
    middleware: ["authenticate", { authorizeRole: ["RestaurantAdmin"] }],
  },
  {
    route: "/restaurantAll",
    target: process.env.RESTAURANT_SERVICE_URL + 'restaurantAll',
    middleware: ["authenticate"],
  },
  {
    route: "/restaurantAdmin",
    target: process.env.RESTAURANT_SERVICE_URL + "restaurantAdmin",
    middleware: ["authenticate", { authorizeRole: ["SystemAdmin"] }],
  },
];

export const limiterConfigs = {
  "/auth": {
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: "Too many authentication attempts, please try again later",
  },
  "/payment": {
    windowMs: 60 * 1000,
    max: 1000,
    message: "Too many payment requests, please try again later",
  },
  "/order": {
    windowMs: 60 * 1000,
    max: 1000,
    message: "Too many order requests, please try again later",
  },
  "/cart": {
    windowMs: 60 * 1000,
    max: 1000,
    message: "Too many cart requests, please try again later",
  },
  "/menu": {
    windowMs: 60 * 1000,
    max: 1000,
  },
  "/menuRes": {
    windowMs: 60 * 1000,
    max: 1000,
  },
  "/restaurant": {
    windowMs: 60 * 1000,
    max: 1000,
  },
  "/restaurantAll": {
    windowMs: 60 * 1000,
    max: 1000,
  },
  "/restaurantAdmin": {
    windowMs: 60 * 1000,
    max: 1000,
  },
  "/delivery": {
    windowMs: 60 * 1000,
    max: 1000,
    message: "Too many requests, please try again later",
  },
  "/driver": {
    windowMs: 60 * 1000,
    max: 1000,
    message: "Too many requests, please try again later",
  },
  default: {
    windowMs: 60 * 1000,
    max: 1000,
    message: "Too many requests, please try again later",
  },
};

export const securityConfig = {
  cors: {
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
};
