import Driver from '../models/driver.model.js';
import axios from 'axios';

export const createDriver = async (driverData, userId) => {
  try {
    // 1. Fetch user info from Auth-Service
    const userRes = await axios.get(`http://localhost:5000/auth/user`, {
      headers: { 'x-user-id': userId }});
    const user = userRes.data.user;

    // 2. Check if user exists and is DeliveryPersonnel
    if (!user) throw new Error('User not found');
    if (user.role !== 'DeliveryPersonnel') throw new Error('User must have DeliveryPersonnel role');

    // 3. Create the driver profile
    const driver = new Driver({
      userId: user._id,
      name: user.name,
      phoneNumber: user.contact,
      vehicleType: driverData.vehicleType,
      vehicleNumber: driverData.vehicleNumber,
      licenseNumber: driverData.licenseNumber,
      status: driverData.status || 'offline',
      currentLocation: driverData.currentLocation || { lat: 0, lng: 0 },
      rating: driverData.rating || 0,
      totalDeliveries: driverData.totalDeliveries || 0
    });

    const savedDriver = await driver.save();
    return savedDriver;
  } catch (error) {
    throw error;
  }
};

export const getDriverById = async (driverId) => {
  try {
    const driver = await Driver.findById(driverId);
    
    if (!driver) {
      throw new Error('Driver not found');
    }
    
    return driver;
  } catch (error) {
    throw error;
  }
};

export const getDriverByParamId = async (driverId) => {
  try {
    const driver = await Driver.findOne({ userId: driverId });
    if (!driver) {
      throw new Error('Driver not found');
    }
    return driver;
  } catch (error) {
    throw error;
  }
};



export const updateDriverLocation = async (driverId, location) => {
  try {
    const driver = await Driver.findOne({ userId: driverId });
    console.log(driverId)
    if (!driver) {
      throw new Error('Driver not found');
    }
    
    driver.currentLocation = {
      lat: location.lat || location.latitude,
      lng: location.lng || location.longitude
    };
    
    const updatedDriver = await driver.save();
    return updatedDriver;
  } catch (error) {
    throw error;
  }
};


export const updateDriverAvailability = async (driverId, status) => {
  try {
    const driver = await Driver.findById(driverId);
    
    if (!driver) {
      throw new Error('Driver not found');
    }
    
    // Ensure status is one of the allowed values
    if (!['available', 'busy', 'offline'].includes(status)) {
      throw new Error('Invalid status value');
    }
    
    driver.status = status;
    const updatedDriver = await driver.save();
    return updatedDriver;
  } catch (error) {
    throw error;
  }
};


export const getAllAvailableDrivers = async () => {
  try {
    const drivers = await Driver.find({ status: 'available' });
    return drivers;
  } catch (error) {
    throw error;
  }
};

export const updateDriverRating = async (driverId, rating) => {
  try {
    const driver = await Driver.findById(driverId);
    
    if (!driver) {
      throw new Error('Driver not found');
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

