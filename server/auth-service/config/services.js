export const services = [
  {
    route: "/delivery",
    target: "http://localhost:5002/delivery",
    middleware: ["authenticate", { authorizeRole: ["DeliveryPersonnel", "Customer", "RestaurantAdmin"] }],
  },
   {
    route: "/driver",
    target: "http://localhost:5002/driver",
    middleware: ["authenticate", { authorizeRole: ["DeliveryPersonnel", "Customer", "RestaurantAdmin"] }],
  },
  {
    route: "/menuRes",
    target: "http://localhost:5003",
    middleware: [
      "authenticate",
      { authorizeRole: ["SystemAdmin", "RestaurantAdmin"] },
    ],
  },
  {
    route: "/menu",
    target: "http://localhost:5003",
    middleware: ["authenticate"],
  },
  {
    route: "/notification",
    target: "http://localhost:5004",
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
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // 30 requests per windowMs
    message: "Too many authentication attempts, please try again later",
  },
  "/payment": {
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: "Too many payment requests, please try again later",
  },
  "/order": {
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    message: "Too many order requests, please try again later",
  },
  "/cart": {
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    message: "Too many cart requests, please try again later",
  },
  "/menu": {
    windowMs: 60 * 1000,
    max: 100,
  },
 "/restaurant": {
    windowMs: 60 * 1000,
    max: 50,
  },
  "/restaurantAll": {
    windowMs: 60 * 1000,
    max: 50,
  },
  "/restaurantAdmin": {
    windowMs: 60 * 1000,
    max: 50,
  },
  "/delivery": {
    windowMs: 60 * 1000, // 1 minute
    max: 50, // 50 requests per minute
    message: "Too many requests, please try again later",
  },
  "/driver": {
    windowMs: 60 * 1000, // 1 minute
    max: 50, // 50 requests per minute
    message: "Too many requests, please try again later",
  },
  default: {
    windowMs: 60 * 1000, // 1 minute
    max: 50, // 50 requests per minute
    message: "Too many requests, please try again later",
  },
};

export const securityConfig = {
  cors: {
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600, // 10 minutes
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};
