import * as driverService from "../services/driver.service.js";

// Create a new driver
export const createDriver = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const driverData = req.body;
    const driver = await driverService.createDriver(driverData, userId);
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get driver by id
export const getDriverById = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const driver = await driverService.getDriverById(userId);
    res.status(200).json(driver);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//get driver by id param
export const getDriverByIdParam = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await driverService.getDriverByParamId(id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//get nearest ready orders for the driver
export const getNearestReadyOrders = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const nearestOrders = await driverService.getNearestReadyOrders(userId);
    res.status(200).json(nearestOrders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//update driver location
export const updateDriverLocation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { location } = req.body;
    const updatedDriver = await driverService.updateDriverLocation(
      userId,
      location
    );
    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//update driver availability
export const updateDriverAvailability = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { isAvailable } = req.body;
    const updatedDriver = await driverService.updateDriverAvailability(
      userId,
      isAvailable
    );
    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get all available drivers
export const getAllAvailableDrivers = async (req, res) => {
  try {
    const drivers = await driverService.getAllAvailableDrivers();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//update driver rating
export const updateDriverRating = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { rating } = req.body;
    const updatedDriver = await driverService.updateDriverRating(
      userId,
      rating
    );
    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//check if a driver exists for the authenticated user
export const checkDriverByUserId = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const driver = await driverService.checkDriverByUserId(userId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
