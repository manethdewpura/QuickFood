import Delivery from '../models/delivery.model.js';
import Driver from '../models/driver.model.js';
import { generateVerificationCode, calculateDistance } from '../utils/helpers.js';
import { emitLocationUpdate, emitStatusUpdate } from '../socket.js';
import axios from 'axios'; // Import axios for making HTTP requests

export const createDelivery = async (orderData, userId) => {
    try {
        // Find the nearest available driver
        // const driver = await findNearestDriver({
        //     lat: orderData.restaurant.latitude,
        //     lng: orderData.restaurant.longitude
        // });

        // if (!driver) {
        //     throw new Error('No available drivers found');
        // }

        const driver = await Driver.findOne({ userId: userId }); 
        console.log(driver)

        // Generate a verification code for delivery confirmation
        const verificationCode = generateVerificationCode();

        // Extract pickup and delivery coordinates
        const pickupCoords = {
            lat: orderData.restaurant.latitude,
            lng: orderData.restaurant.longitude
        };
        const deliveryCoords = {
            lat: orderData.customerLatitude,
            lng: orderData.customerLongitude
        };

        // Create a new delivery with the correct structure
        const delivery = new Delivery({
            orderId: orderData._id,
            driverId: driver.userId,
            restaurantId: orderData.restaurantId,
            customerId: orderData.customerId,
            status: 'assigned',
            pickupLocation: {
                address: orderData.restaurant.Address,
                coordinates: pickupCoords
            },
            deliveryLocation: {
                address: 'Customer Address', // Replace with actual customer address if available
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

export const updateDeliveryStatus = async (deliveryId, status, currentLocation) => {
    try {
        const delivery = await Delivery.findById(deliveryId);

        if (!delivery) throw new Error('Delivery not found');

        delivery.status = status;

        if (status === 'picked_up') {
            delivery.pickedUpAt = new Date();

        } else if (status === 'delivered') {
            delivery.deliveredAt = new Date();

            // Update the order status to "Delivered"
            await axios.put(
                `http://localhost:5005/order/status/${delivery.orderId}`,
                { orderStatus: "Delivered" }
            );

            await Driver.findByIdAndUpdate(delivery.driverId, {
                status: 'available',
                $inc: { totalDeliveries: 1 }
            });
        }

        // Snap driver location to pickup or delivery point on status change
        if (status === 'picked_up') {
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

export const getDeliveryByOrderId = async (orderId) => {
    try {
        const delivery = await Delivery.findOne({ orderId });
        return delivery;
    } catch (error) {
        throw error;
    }
};

export const verifyDeliveryCode = async (orderId, verificationCode) => {
    try {
        const delivery = await Delivery.findOne({ orderId, verificationCode });

        if (!delivery) {
            return false;
        }
        return true;

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getDeliveriesByDriver = async (driverId) => {
    try {
        const deliveries = await Delivery.find({
            driverId:driverId,
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
            .sort({ createdAt: -1 });

        // Fetch restaurant details for each delivery
        const deliveriesWithRestaurantDetails = await Promise.all(
            deliveries.map(async (delivery) => {
                if (delivery.restaurantId) {
                    try {
                        const response = await axios.get(
                            `http://localhost:5007/restaurantAll/${delivery.restaurantId}`
                        );
                        if (response.data && response.data.data) {
                            delivery = delivery.toObject(); // Convert Mongoose document to plain object
                            delivery.restaurantDetails = response.data.data; // Attach restaurant details
                        }
                    } catch (error) {
                        console.error(
                            `Failed to fetch restaurant details for ID: ${delivery.restaurantId}`,
                            error.message
                        );
                        delivery.restaurantDetails = null; // Handle failure gracefully
                    }
                }
                return delivery;
            })
        );

        return deliveriesWithRestaurantDetails;
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

const findNearestDriver = async (pickupLocation) => {
    try {
        const availableDrivers = await Driver.find({ status: 'available' });

        if (availableDrivers.length === 0) {
            return null;
        }

        const driversWithDistance = availableDrivers.map(driver => {
            const distance = calculateDistance(
                driver.currentLocation.lat,
                driver.currentLocation.lng,
                pickupLocation.lat,
                pickupLocation.lng
            );

            return { driver, distance };
        });

        driversWithDistance.sort((a, b) => a.distance - b.distance);

        return driversWithDistance[0].driver;
    } catch (error) {
        throw error;
    }
};

const calculateEstimatedDeliveryTime = (driverLocation, pickupLocation, deliveryLocation) => {
    try {
        if (!driverLocation || !pickupLocation || !deliveryLocation) {
            console.error('Missing location data:', { driverLocation, pickupLocation, deliveryLocation });
            return new Date(Date.now() + 30 * 60 * 1000);
        }

        const driverLat = driverLocation.lat || driverLocation.latitude || 0;
        const driverLng = driverLocation.lng || driverLocation.longitude || 0;
        const pickupLat = pickupLocation.lat || pickupLocation.latitude || 0;
        const pickupLng = pickupLocation.lng || pickupLocation.longitude || 0;
        const deliveryLat = deliveryLocation.lat || deliveryLocation.latitude || 0;
        const deliveryLng = deliveryLocation.lng || deliveryLocation.longitude || 0;

        const distanceToRestaurant = calculateDistance(
            driverLat,
            driverLng,
            pickupLat,
            pickupLng
        );

        const distanceToCustomer = calculateDistance(
            pickupLat,
            pickupLng,
            deliveryLat,
            deliveryLng
        );

        const averageSpeed = 30;

        const timeToRestaurant = distanceToRestaurant / averageSpeed;
        const timeToCustomer = distanceToCustomer / averageSpeed;

        const pickupTime = 10 / 60;

        const totalTimeInHours = timeToRestaurant + pickupTime + timeToCustomer;
        const totalTimeInMs = totalTimeInHours * 60 * 60 * 1000;

        const estimatedTime = new Date(Date.now() + totalTimeInMs);

        if (isNaN(estimatedTime.getTime())) {
            console.error('Invalid date calculation:', {
                distanceToRestaurant,
                distanceToCustomer,
                totalTimeInHours,
                totalTimeInMs
            });
            return new Date(Date.now() + 30 * 60 * 1000);
        }

        return estimatedTime;
    } catch (error) {
        console.error('Error calculating estimated delivery time:', error);
        return new Date(Date.now() + 30 * 60 * 1000);
    }
};
