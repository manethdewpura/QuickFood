import * as restaurantService from "../services/restaurant.service.js";

//Create a new restaurant
export const createRestaurant = async (req, res) => {
  try {
    const restaurantAdminId = req.headers["x-user-id"];
    const restaurantData = {
      ...req.body,
      restaurantAdminId,
    };
    const restaurant = await restaurantService.createRestaurant(restaurantData);
    res.status(201).json({
      success: true,
      message: "Restaurant created successfully.",
      data: restaurant,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Get all restaurants
export const getAllVerifiedRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantService.getVerfiedRestaurants();
    res.status(200).json({
      success: true,
      message: "Restaurants data fetched successfully.",
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update restaurant verification status by ID
export const updateVerification = async (req, res) => {
  try {
    const { isVerified } = req.body;
    const updatedVerification = await restaurantService.updateVerification(
      req.params.id,
      isVerified
    );
    res.status(200).json({
      success: true,
      message: "Restaurant verification status updated successfully.",
      data: updatedVerification,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    res.status(200).json({
      success: true,
      message: "Restaurants data fetched successfully.",
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get a restaurant by ID
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Restaurant data fetched successfully.",
      data: restaurant,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

//Update a restaurant details by ID
export const updateRestaurant = async (req, res) => {
  try {
    const updatedRestaurant = await restaurantService.updateRestaurant(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully.",
      data: updatedRestaurant,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Delete a restaurant by ID
export const deleteRestaurant = async (req, res) => {
  try {
    const deletedRestaurant = await restaurantService.deleteRestaurant(
      req.params.id
    );
    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully.",
      data: deletedRestaurant,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

//Update restaurant availability by ID
export const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: 'Invalid input. "isAvailable" must be a boolean.',
      });
    }

    const updatedAvailability = await restaurantService.updateAvailability(
      req.params.id,
      isAvailable
    );
    res.status(200).json({
      success: true,
      message: "Restaurant availability updated successfully.",
      data: updatedAvailability,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//get the nearest restaurants by location
export const getNearestRestaurants = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required.",
      });
    }

    const nearest = await restaurantService.getNearestRestaurants(
      parseFloat(latitude),
      parseFloat(longitude)
    );
    res.status(200).json({
      success: true,
      message: "Nearest restaurants fetched successfully.",
      data: nearest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get the restaurant by user ID
export const getRestaurantsByUserId = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const restaurant = await restaurantService.getRestaurantsByUserId(userId);
    res.status(200).json({
      success: true,
      message: "Restaurant data fetched successfully.",
      data: restaurant,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

//verify order by restaurant
export const verifyOrder = async (req, res) => {
  try {
    const { orderId, verificationCode } = req.params;

    const restaurant = await restaurantService.verifyOrderforPickup(
      orderId,
      verificationCode
    );
    res.status(200).json({
      restaurant,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

//Search restaurants by name
export const searchRestaurants = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }
    const restaurants = await restaurantService.searchRestaurantsByName(query);
    res.status(200).json({
      success: true,
      message: "Restaurants found successfully",
      data: restaurants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
