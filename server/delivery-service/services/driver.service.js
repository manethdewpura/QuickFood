import Driver from "../models/driver.model.js";
import axios from "axios";
import { calculateDistance } from "../utils/helpers.js";

export const createDriver = async (driverData, userId) => {
  try {
    // Check if a driver already exists for the given userId
    const existingDriver = await Driver.findOne({ userId });
    if (existingDriver) {
      throw new Error("Driver already exists for this user");
    }
    //Fetch user info from Auth-Service
    const userRes = await axios.get(`http://localhost:5000/auth/user`, {
      headers: { "x-user-id": userId },
    });
    const user = userRes.data.user;

    //Check if user exists and is DeliveryPersonnel
    if (!user) throw new Error("User not found");
    if (user.role !== "DeliveryPersonnel")
      throw new Error("User must have DeliveryPersonnel role");

    // Create the driver profile
    const driver = new Driver({
      userId: user._id,
      name: user.name,
      phoneNumber: user.contact,
      vehicleType: driverData.vehicleType,
      vehicleNumber: driverData.vehicleNumber,
      licenseNumber: driverData.licenseNumber,
      status: driverData.status || "offline",
      currentLocation: driverData.currentLocation || { lat: 0, lng: 0 },
      rating: driverData.rating || 0,
      totalDeliveries: driverData.totalDeliveries || 0,
    });

    const savedDriver = await driver.save();
    return savedDriver;
  } catch (error) {
    throw error;
  }
};

// Fetch driver by userId
export const getDriverById = async (driverId) => {
  try {
    const driver = await Driver.findById(driverId);

    if (!driver) {
      throw new Error("Driver not found");
    }

    return driver;
  } catch (error) {
    throw error;
  }
};

// Fetch driver by userId from params
export const getDriverByParamId = async (driverId) => {
  try {
    const driver = await Driver.findOne({ userId: driverId });
    if (!driver) {
      throw new Error("Driver not found");
    }
    return driver;
  } catch (error) {
    throw error;
  }
};

//get nearest ready orders for the driver
export const getNearestReadyOrders = async (userId) => {
  const driver = await Driver.findOne({ userId });
  if (!driver) throw new Error("Driver not found");
  if (
    !driver.currentLocation ||
    typeof driver.currentLocation.lat !== "number" ||
    typeof driver.currentLocation.lng !== "number"
  ) {
    throw new Error("Driver location not set");
  }

  const { data } = await axios.get("http://localhost:5005/order/ready");
  const readyOrders = data.data || [];

  const ordersWithDistance = readyOrders.map((order) => {
    const distance = calculateDistance(
      driver.currentLocation.lat,
      driver.currentLocation.lng,
      order.restaurant.latitude,
      order.restaurant.longitude
    );

    // Create notification for each order
    axios
      .post("http://localhost:5004/notifications/driver", {
        userId,
        name: order._id,
        message: `New order #${order._id} available for delivery from ${order.restaurant.name}`,
      })
      .catch((error) => console.error("Failed to create notification:", error));

    return { ...order, distance };
  });

  ordersWithDistance.sort((a, b) => a.distance - b.distance);
  return ordersWithDistance;
};

//update driver location
export const updateDriverLocation = async (driverId, location) => {
  try {
    const driver = await Driver.findOne({ userId: driverId });
    if (!driver) {
      throw new Error("Driver not found");
    }

    driver.currentLocation = {
      lat: location.lat || location.latitude,
      lng: location.lng || location.longitude,
    };

    const updatedDriver = await driver.save();
    return updatedDriver;
  } catch (error) {
    throw error;
  }
};

//update driver availability
export const updateDriverAvailability = async (driverId, status) => {
  try {
    const driver = await Driver.findById(driverId);

    if (!driver) {
      throw new Error("Driver not found");
    }

    // Ensure status is one of the allowed values
    if (!["available", "busy", "offline"].includes(status)) {
      throw new Error("Invalid status value");
    }

    driver.status = status;
    const updatedDriver = await driver.save();
    return updatedDriver;
  } catch (error) {
    throw error;
  }
};

// Fetch all available drivers
export const getAllAvailableDrivers = async () => {
  try {
    const drivers = await Driver.find({ status: "available" });
    return drivers;
  } catch (error) {
    throw error;
  }
};

//update driver rating
export const updateDriverRating = async (driverId, rating) => {
  try {
    const driver = await Driver.findById(driverId);

    if (!driver) {
      throw new Error("Driver not found");
    }

    // Calculate new average rating
    const totalRatings = driver.totalDeliveries;
    const currentRatingSum = driver.rating * totalRatings;
    const newRatingSum = currentRatingSum + rating;
    const newAverageRating = newRatingSum / (totalRatings + 1);

    driver.rating = newAverageRating;

    const updatedDriver = await driver.save();
    return updatedDriver;
  } catch (error) {
    throw error;
  }
};

// Check if a driver exists for the authenticated user
export const checkDriverByUserId = async (userId) => {
  try {
    const driver = await Driver.findOne({ userId });
    return driver;
  } catch (error) {
    throw error;
  }
};
