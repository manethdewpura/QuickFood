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
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Restaurant', restaurantSchema);