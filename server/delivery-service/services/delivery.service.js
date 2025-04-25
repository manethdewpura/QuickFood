import Delivery from '../models/delivery.model.js';
import Driver from '../models/driver.model.js';
import { generateVerificationCode, calculateDistance } from '../utils/helpers.js';
import { emitLocationUpdate, emitStatusUpdate } from '../socket.js';


// export const createDelivery = async (orderData) => {
//     try {
//         // Find the nearest available driver
//         const driver = await findNearestDriver(orderData.pickupLocation);

//         if (!driver) {
//             throw new Error('No available drivers found');
//         }

//         // Generate a verification code for delivery confirmation
//         const verificationCode = generateVerificationCode();

//         // Create a new delivery
//         const delivery = new Delivery({
//             orderId: orderData.orderId,
//             driverId: driver._id,
//             restaurantId: orderData.restaurantId,
//             customerId: orderData.customerId,
//             pickupLocation: orderData.pickupLocation,
//             deliveryLocation: orderData.deliveryLocation,
//             currentLocation: driver.currentLocation,
//             estimatedDeliveryTime: calculateEstimatedDeliveryTime(
//                 driver.currentLocation,
//                 orderData.pickupLocation,
//                 orderData.deliveryLocation
//             ),
//             verificationCode
//         });

//         // Update driver status to busy
//         await Driver.findByIdAndUpdate(driver._id, { status: 'busy' });

//         // Save the delivery
//         const savedDelivery = await delivery.save();
//         return savedDelivery;
//     } catch (error) {
//         throw error;
//     }
// };

export const createDelivery = async (orderData) => {
    try {
        // Find the nearest available driver
        const driver = await findNearestDriver(orderData.pickupLocation);

        if (!driver) {
            throw new Error('No available drivers found');
        }

        // Generate a verification code for delivery confirmation
        const verificationCode = generateVerificationCode();

        // --- FIX: Always extract coordinates from latitude/longitude or coordinates.lat/lng ---
        const extractCoordinates = (loc) => {
            if (!loc) return { lat: 0, lng: 0 };
            if (loc.coordinates) {
                return {
                    lat: loc.coordinates.lat || loc.coordinates.latitude || 0,
                    lng: loc.coordinates.lng || loc.coordinates.longitude || 0
                };
            }
            return {
                lat: loc.lat || loc.latitude || 0,
                lng: loc.lng || loc.longitude || 0
            };
        };

        const pickupCoords = extractCoordinates(orderData.pickupLocation);
        const deliveryCoords = extractCoordinates(orderData.deliveryLocation);

        // Create a new delivery with the correct structure
        const delivery = new Delivery({
            orderId: orderData.orderId,
            driverId: driver.userId,
            restaurantId: orderData.restaurantId,
            customerId: orderData.customerId,
            status: 'assigned',
            pickupLocation: {
                address: orderData.pickupLocation.address,
                coordinates: pickupCoords
            },
            deliveryLocation: {
                address: orderData.deliveryLocation.address,
                coordinates: deliveryCoords
            },
            currentLocation: {
                coordinates: {
                    lat: driver.currentLocation.lat,
                    lng: driver.currentLocation.lng
                }
            },
            estimatedDeliveryTime: calculateEstimatedDeliveryTime(
                driver.currentLocation,
                pickupCoords,
                deliveryCoords
            ),
            verificationCode,
            assignedAt: new Date()
        });

        // Update driver status to busy
        await Driver.findByIdAndUpdate(driver._id, { status: 'busy' });

        // Save the delivery
        const savedDelivery = await delivery.save();
        return savedDelivery;
    } catch (error) {
        throw error;
    }
};




export const getDeliveryById = async (deliveryId) => {
    try {
        const delivery = await Delivery.findById(deliveryId)
            .populate('driverId', 'name phoneNumber vehicleType vehicleNumber rating')
            .populate('orderId', 'items totalAmount')
            .populate('restaurantId', 'name address phoneNumber');

        if (!delivery) {
            throw new Error('Delivery not found');
        }

        return delivery;
    } catch (error) {
        throw error;
    }
};

// export const updateDeliveryStatus = async (deliveryId, status, currentLocation) => {
//     try {
//         const delivery = await Delivery.findById(deliveryId);

//         if (!delivery) {
//             throw new Error('Delivery not found');
//         }

//         delivery.status = status;

//         if (currentLocation) {
//             delivery.currentLocation = {
//                 ...currentLocation,
//                 updatedAt: new Date()
//             };

//             // Emit location update via Socket.IO
//             emitLocationUpdate(deliveryId, {
//                 deliveryId,
//                 status,
//                 currentLocation: delivery.currentLocation
//             });
//         }

//         if (status === 'delivered') {
//             delivery.actualDeliveryTime = new Date();
//             // Make driver available again
//             await Driver.findByIdAndUpdate(delivery.driverId, {
//                 isAvailable: true,
//                 $inc: { deliveryCount: 1 }
//             });
//         }

//         const updatedDelivery = await delivery.save();
//         return updatedDelivery;
//     } catch (error) {
//         throw error;
//     }
// };

export const updateDeliveryStatus = async (deliveryId, status, currentLocation) => {
    try {
        const delivery = await Delivery.findById(deliveryId);

        if (!delivery) throw new Error('Delivery not found');

        delivery.status = status;

        if (status === 'picked_up') {
            delivery.pickedUpAt = new Date();
        } else if (status === 'delivered') {
            delivery.deliveredAt = new Date();
            await Driver.findByIdAndUpdate(delivery.driverId, {
                status: 'available',
                $inc: { totalDeliveries: 1 }
            });
        }

        // Snap driver location to pickup or delivery point on status change
        if (status === 'picked_up') {
            // Always snap to restaurant location
            delivery.currentLocation = {
                coordinates: {
                    lat: delivery.pickupLocation.coordinates.lat,
                    lng: delivery.pickupLocation.coordinates.lng
                },
                updatedAt: new Date()
            };
            emitLocationUpdate(deliveryId, {
                deliveryId,
                status,
                currentLocation: delivery.currentLocation
            });
            emitStatusUpdate(deliveryId, {
                deliveryId,
                status
            });
        } else if (status === 'delivered') {
            delivery.currentLocation = {
                coordinates: {
                    lat: delivery.deliveryLocation.coordinates.lat,
                    lng: delivery.deliveryLocation.coordinates.lng
                },
                updatedAt: new Date()
            };
            emitLocationUpdate(deliveryId, {
                deliveryId,
                status,
                currentLocation: delivery.currentLocation
            });
            emitStatusUpdate(deliveryId, {
                deliveryId,
                status
            });
        } else if (currentLocation) {
            // Use provided currentLocation for other statuses
            let lat, lng;
            if (currentLocation.coordinates) {
                lat = currentLocation.coordinates.lat || currentLocation.coordinates.latitude;
                lng = currentLocation.coordinates.lng || currentLocation.coordinates.longitude;
            } else {
                lat = currentLocation.lat || currentLocation.latitude;
                lng = currentLocation.lng || currentLocation.longitude;
            }
            delivery.currentLocation = {
                coordinates: { lat, lng },
                updatedAt: new Date()
            };
            emitLocationUpdate(deliveryId, {
                deliveryId,
                status,
                currentLocation: delivery.currentLocation
            });
            emitStatusUpdate(deliveryId, {
                deliveryId,
                status
            });
        }


        // Always restore pickupLocation and deliveryLocation coordinates if missing or invalid
        const original = await Delivery.findById(deliveryId).lean();
        if (
            !delivery.pickupLocation.coordinates ||
            typeof delivery.pickupLocation.coordinates.lat !== 'number' ||
            typeof delivery.pickupLocation.coordinates.lng !== 'number'
        ) {
            if (original && original.pickupLocation && original.pickupLocation.coordinates) {
                delivery.pickupLocation.coordinates = original.pickupLocation.coordinates;
            }
        }
        if (
            !delivery.deliveryLocation.coordinates ||
            typeof delivery.deliveryLocation.coordinates.lat !== 'number' ||
            typeof delivery.deliveryLocation.coordinates.lng !== 'number'
        ) {
            if (original && original.deliveryLocation && original.deliveryLocation.coordinates) {
                delivery.deliveryLocation.coordinates = original.deliveryLocation.coordinates;
            }
        }

        const updatedDelivery = await delivery.save();
        return updatedDelivery;

    } catch (error) {
        throw error;
    }
};





// Add a new function for direct location updates
export const updateDriverLocation = async (deliveryId, currentLocation) => {
    try {
        const delivery = await Delivery.findById(deliveryId);

        if (!delivery) {
            throw new Error('Delivery not found');
        }

        // In updateDeliveryStatus and updateDriverLocation
        let lat, lng;
        if (currentLocation.coordinates) {
            lat = currentLocation.coordinates.lat || currentLocation.coordinates.latitude;
            lng = currentLocation.coordinates.lng || currentLocation.coordinates.longitude;
        } else {
            lat = currentLocation.lat || currentLocation.latitude;
            lng = currentLocation.lng || currentLocation.longitude;
        }
        delivery.currentLocation = {
            coordinates: {
                lat,
                lng
            },
            updatedAt: new Date()
        };



        // Emit location update via Socket.IO
        emitLocationUpdate(deliveryId, {
            deliveryId,
            status: delivery.status,
            currentLocation: delivery.currentLocation
        });

        const updatedDelivery = await delivery.save();
        return updatedDelivery;
    } catch (error) {
        throw error;
    }
};

export const verifyDeliveryCode = async (deliveryId, code) => {
    try {
        const delivery = await Delivery.findById(deliveryId);

        if (!delivery) {
            throw new Error('Delivery not found');
        }

        if (delivery.verificationCode !== code) {
            throw new Error('Invalid verification code');
        }

        return true;
    } catch (error) {
        throw error;
    }
};

export const getDeliveriesByDriver = async (driverId) => {
    try {
        const deliveries = await Delivery.find({
            driverId,
            status: { $ne: 'delivered' }
        })
            .populate('orderId', 'items totalAmount')
            .populate('restaurantId', 'name address phoneNumber')
            .sort({ createdAt: -1 });

        return deliveries;
    } catch (error) {
        throw error;
    }
};

export const getDeliveriesByCustomer = async (customerId) => {
    try {
        const deliveries = await Delivery.find({ customerId })
            .populate('driverId', 'name phoneNumber vehicleType vehicleNumber rating')
            .populate('orderId', 'items totalAmount')
            .populate('restaurantId', 'name address phoneNumber')
            .sort({ createdAt: -1 });

        return deliveries;
    } catch (error) {
        throw error;
    }
};

export const getDeliveriesByRestaurant = async (restaurantId) => {
    try {
        const deliveries = await Delivery.find({ restaurantId })
            .populate('driverId', 'name phoneNumber vehicleType vehicleNumber rating')
            .populate('orderId', 'items totalAmount')
            .populate('customerId', 'name phoneNumber')
            .sort({ createdAt: -1 });

        return deliveries;
    } catch (error) {
        throw error;
    }
};

// Helper functions
const findNearestDriver = async (pickupLocation) => {
    try {
        // Find all available drivers
        const availableDrivers = await Driver.find({ status: 'available' });

        if (availableDrivers.length === 0) {
            return null;
        }

        // Calculate distance for each driver
        const driversWithDistance = availableDrivers.map(driver => {
            const distance = calculateDistance(
                driver.currentLocation.lat,
                driver.currentLocation.lng,
                pickupLocation.coordinates ? pickupLocation.coordinates.lat : pickupLocation.lat,
                pickupLocation.coordinates ? pickupLocation.coordinates.lng : pickupLocation.lng
            );

            return { driver, distance };
        });

        // Sort by distance
        driversWithDistance.sort((a, b) => a.distance - b.distance);

        // Return the nearest driver
        return driversWithDistance[0].driver;
    } catch (error) {
        throw error;
    }
};

const calculateEstimatedDeliveryTime = (driverLocation, pickupLocation, deliveryLocation) => {
    try {
        // Check if all required location data is present
        if (!driverLocation || !pickupLocation || !deliveryLocation) {
            console.error('Missing location data:', { driverLocation, pickupLocation, deliveryLocation });
            // Return a default time (e.g., 30 minutes from now) if data is missing
            return new Date(Date.now() + 30 * 60 * 1000);
        }

        // Extract coordinates, handling both lat/lng and latitude/longitude naming conventions
        const driverLat = driverLocation.lat || driverLocation.latitude || 0;
        const driverLng = driverLocation.lng || driverLocation.longitude || 0;
        const pickupLat = pickupLocation.lat || pickupLocation.latitude || 0;
        const pickupLng = pickupLocation.lng || pickupLocation.longitude || 0;
        const deliveryLat = deliveryLocation.lat || deliveryLocation.latitude || 0;
        const deliveryLng = deliveryLocation.lng || deliveryLocation.longitude || 0;

        // Calculate distance from driver to restaurant
        const distanceToRestaurant = calculateDistance(
            driverLat,
            driverLng,
            pickupLat,
            pickupLng
        );

        // Calculate distance from restaurant to customer
        const distanceToCustomer = calculateDistance(
            pickupLat,
            pickupLng,
            deliveryLat,
            deliveryLng
        );

        // Assume average speed of 30 km/h
        const averageSpeed = 30; // km/h

        // Calculate time in hours
        const timeToRestaurant = distanceToRestaurant / averageSpeed;
        const timeToCustomer = distanceToCustomer / averageSpeed;

        // Add 10 minutes for pickup
        const pickupTime = 10 / 60; // 10 minutes in hours

        // Calculate total time in milliseconds
        const totalTimeInHours = timeToRestaurant + pickupTime + timeToCustomer;
        const totalTimeInMs = totalTimeInHours * 60 * 60 * 1000;

        // Ensure we're returning a valid date
        const estimatedTime = new Date(Date.now() + totalTimeInMs);

        // Validate the date before returning
        if (isNaN(estimatedTime.getTime())) {
            console.error('Invalid date calculation:', {
                distanceToRestaurant,
                distanceToCustomer,
                totalTimeInHours,
                totalTimeInMs
            });
            // Return a default time if calculation failed
            return new Date(Date.now() + 30 * 60 * 1000);
        }

        return estimatedTime;
    } catch (error) {
        console.error('Error calculating estimated delivery time:', error);
        // Return a default time if an error occurred
        return new Date(Date.now() + 30 * 60 * 1000);
    }
};


// const calculateEstimatedDeliveryTime = (driverLocation, pickupLocation, deliveryLocation) => {
//     // Calculate distance from driver to restaurant
//     const distanceToRestaurant = calculateDistance(
//         driverLocation.latitude,
//         driverLocation.longitude,
//         pickupLocation.latitude,
//         pickupLocation.longitude
//     );

//     // Calculate distance from restaurant to customer
//     const distanceToCustomer = calculateDistance(
//         pickupLocation.latitude,
//         pickupLocation.longitude,
//         deliveryLocation.latitude,
//         deliveryLocation.longitude
//     );

//     // Assume average speed of 30 km/h
//     const averageSpeed = 30; // km/h

//     // Calculate time in hours
//     const timeToRestaurant = distanceToRestaurant / averageSpeed;
//     const timeToCustomer = distanceToCustomer / averageSpeed;

//     // Add 10 minutes for pickup
//     const pickupTime = 10 / 60; // 10 minutes in hours

//     // Calculate total time in milliseconds
//     const totalTimeInHours = timeToRestaurant + pickupTime + timeToCustomer;
//     const totalTimeInMs = totalTimeInHours * 60 * 60 * 1000;

//     // Return estimated delivery time
//     return new Date(Date.now() + totalTimeInMs);
// };
