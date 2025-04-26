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

//Get all verified restaurants
export const getVerfiedRestaurants = async () => {
    try {
        return await Restaurant.find({ isVerified: 'Approved' }).sort({ createdAt: -1 });
    }
    catch (error) {
        console.error("Error fetching verified restaurants:", error.message);
        throw new Error("Failed to fetch verified restaurants.");
    }
};

// Update restaurant verification status by ID
export const updateVerification = async (id, isVerified) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid restaurant ID format.");
        }
        const updatedVerification = await Restaurant.findByIdAndUpdate(
            id,
            { isVerified },
            { new: true }
        );

        if (!updatedVerification) {
            throw new Error("Restaurant not found.");
        }
        return updatedVerification;
    }
    catch (error) {
        console.error("Error updating restaurant verification:", error.message);
        throw new Error("Failed to update restaurant verification.");
    }
};

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

//Ger the nearest restaurants by location 
export const getNearestRestaurants = async (lat, lon) => {
    const allRestaurants = await Restaurant.find({ isAvailable: true });
    
    const withDistance = allRestaurants.map(restaurant => {
        const distance = calculateDistance(lat, lon, restaurant.location.latitude, restaurant.location.longitude);
        return { ...restaurant.toObject(), distance };
    }
    );

    withDistance.sort((a, b) => a.distance - b.distance);
    return withDistance.slice(0, 5); // Return the 5 nearest restaurants or if less all

};
//Calculate the distance between two geographical points using Haversine formula    
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};


//get restaurant by user id
export const getRestaurantsByUserId = async (userId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID format.");
        }
        const restaurant = await Restaurant.find({ restaurantAdminId: userId });
        if (!restaurant) {
            throw new Error("Restaurant not found for this user.");
        }
        return restaurant;
    }
    catch (error) {
        console.error("Error fetching restaurant by user ID:", error.message);
        throw new Error("Failed to fetch restaurant by user ID.");
    }
};
