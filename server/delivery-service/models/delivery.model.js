import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    restaurantId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    driverId: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
        default: 'assigned'
    },
    pickupLocation: {
        address: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    deliveryLocation: {
        address: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    currentLocation: {
        address: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    verificationCode: {
        type: String,
        required: true
    },
    assignedAt: {
        type: Date,
        default: Date.now
    },
    pickedUpAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    },
    estimatedDeliveryTime: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('Delivery', DeliverySchema);
