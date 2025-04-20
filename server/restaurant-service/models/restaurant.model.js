import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    Hotline: {
        type: String,
        required: true,
    },
    Rate: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    cuisineType: {
        type: String,
        required: false,
    },
    OpeningHours: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Restaurant', restaurantSchema);