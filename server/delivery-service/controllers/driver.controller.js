import * as driverService from '../services/driver.service.js';

export const createDriver = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    console.log('User ID from headers:', userId); // Log the user ID for debugging
    const driverData = req.body;
    const driver = await driverService.createDriver(driverData, userId);
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDriverById = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const driver = await driverService.getDriverById(userId);
    res.status(200).json(driver);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDriverByIdParam = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await driverService.getDriverByParamId(id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateDriverLocation = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { location } = req.body;
    const updatedDriver = await driverService.updateDriverLocation(userId, location);
    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDriverAvailability = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { isAvailable } = req.body;
    const updatedDriver = await driverService.updateDriverAvailability(userId, isAvailable);
    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllAvailableDrivers = async (req, res) => {
  try {
    const drivers = await driverService.getAllAvailableDrivers();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDriverRating = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { rating } = req.body;
    const updatedDriver = await driverService.updateDriverRating(userId, rating);
    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
