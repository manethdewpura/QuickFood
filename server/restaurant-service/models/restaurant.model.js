import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    restaurantAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    restaurantName: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },
    Hotline: {
        type: String,
        required: true,
    },
    OpeningHours: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    Latitude: {
        type: Number,
        required: true,
    },
    Longitude: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Restaurant', restaurantSchema);