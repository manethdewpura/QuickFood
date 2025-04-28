export const services = [
  {
    route: "/delivery",
    target: "http://localhost:5002/delivery",
    middleware: [
      "authenticate",
      { authorizeRole: ["DeliveryPersonnel", "Customer", "RestaurantAdmin"] },
    ],
  },
  {
    route: "/driver",
    target: "http://localhost:5002/driver",
    middleware: [
      "authenticate",
      { authorizeRole: ["DeliveryPersonnel", "Customer", "RestaurantAdmin"] },
    ],
  },
  {
    route: "/menuRes",
    target: "http://localhost:5003/menuRes",
    middleware: [
      "authenticate",
      { authorizeRole: ["SystemAdmin", "RestaurantAdmin"] },
    ],
  },
  {
    route: "/menu",
    target: "http://localhost:5003/menu",
    middleware: ["authenticate"],
  },
  {
    route: "/notifications",
    target: "http://localhost:5004/notifications",
    middleware: ["authenticate"],
  },
  {
    route: "/cart",
    target: "http://localhost:5005/cart",
    middleware: ["authenticate"],
  },
  {
    route: "/order",
    target: "http://localhost:5005/order",
    middleware: ["authenticate"],
  },
  {
    route: "/payment",
    target: "http://localhost:5006/payment",
    middleware: ["authenticate"],
  },
  {
    route: "/restaurant",
    target: "http://localhost:5007/restaurant",
    middleware: ["authenticate", { authorizeRole: ["RestaurantAdmin"] }],
  },
  {
    route: "/restaurantAll",
    target: "http://localhost:5007/restaurantAll",
    middleware: ["authenticate"],
  },
  {
    route: "/restaurantAdmin",
    target: "http://localhost:5007/restaurantAdmin",
    middleware: ["authenticate", { authorizeRole: ["SystemAdmin"] }],
  },
];

export const limiterConfigs = {
  "/auth": {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many authentication attempts, please try again later",
  },
  "/payment": {
    windowMs: 60 * 1000,
    max: 100,
    message: "Too many payment requests, please try again later",
  },
  "/order": {
    windowMs: 60 * 1000,
    max: 100,
    message: "Too many order requests, please try again later",
  },
  "/cart": {
    windowMs: 60 * 1000,
    max: 100,
    message: "Too many cart requests, please try again later",
  },
  "/menu": {
    windowMs: 60 * 1000,
    max: 100,
  },
  "/menuRes": {
    windowMs: 60 * 1000,
    max: 100,
  },
  "/restaurant": {
    windowMs: 60 * 1000,
    max: 100,
  },
  "/restaurantAll": {
    windowMs: 60 * 1000,
    max: 100,
  },
  "/restaurantAdmin": {
    windowMs: 60 * 1000,
    max: 100,
  },
  "/delivery": {
    windowMs: 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later",
  },
  "/driver": {
    windowMs: 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later",
  },
  default: {
    windowMs: 60 * 1000,
    max: 50,
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
