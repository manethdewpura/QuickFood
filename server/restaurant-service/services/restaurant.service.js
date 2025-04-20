import Restaurant from '../models/restaurant.model.js';
import mongoose from 'mongoose';

//Create a new restaurant
export const createRestaurant = async (restaurantData) => {
    try {
        const newRestaurant = new Restaurant(restaurantData);
        await newRestaurant.validate();
        return await newRestaurant.save();
    }
    catch (error) {
        console.error("Error creating restaurant:", error);
        throw new Error("Failed to create restaurant.");
    }
};

//Get all restaurants
export const getAllRestaurants = async () => {
    try {
        return await Restaurant.find().sort({ createdAt: -1 });
    }
    catch (error) {
        console.error("Error fetching restaurants:", error.message);
        throw new Error("Failed to fetch restaurants.");
    }
};

//Get a restaurant by ID
export const getRestaurantById = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid restaurant ID format.")
        }
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            throw new Error("Restaurant not found.");
        }
        return restaurant;
    }
    catch (error) {
        console.error("Error fetching restaurant by ID:", error.message);
        throw new Error("Failed to fetch restaurant by ID.");
    }
};

//Update a restaurant details by ID
export const updateRestaurant = async (id, restaurantData) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid restaurant ID format.");
        }
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, restaurantData, {
            new: true,
            runValidators: true
        });

        if (!updatedRestaurant) {
            throw new Error("Restaurant not found.");
        }
        return updatedRestaurant;
    }
    catch (error) {
        console.error("Error updating restaurant:", error.message);
        throw new Error("Failed to update restaurant.");
    }
};

//Delete a restaurant details by ID
export const deleteRestaurant = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid restaurant ID format.");
        }
        const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
        if (!deletedRestaurant) {
            throw new Error("Restaurant not found.");
        }
        return deletedRestaurant;
    }
    catch (error) {
        console.error("Error deleting restaurant:", error.message);
        throw new Error("Failed to delete restaurant.");
    }
}

//Update restaurant availability status by ID
export const updateAvailability = async (id, isAvailable) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid restaurant ID format.");
        }
        const updatedAvailability = await Restaurant.findByIdAndUpdate(
            id,
            { isAvailable },
            { new: true }
        );
        
        if (!updatedAvailability) {
            throw new Error("Restaurant not found.");
        }
        return updatedAvailability;
    }
    catch (error) {
        console.error("Error updating restaurant availability:", error.message);
        throw new Error("Failed to update restaurant availability.");
    }
};