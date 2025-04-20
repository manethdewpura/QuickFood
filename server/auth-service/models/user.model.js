import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['RestaurantAdmin', 'Customer', 'DeliveryPersonnel'],
        default: 'Customer',
        required: true,
    },
    contact: {
        type: String,
        required: function () {
            return this.role === 'Customer' || this.role === 'DeliveryPersonnel';
        },
    },
    address: {
        type: String,
        required: function () {
            return this.role === 'Customer' || this.role === 'DeliveryPersonnel';
        },
    }
}, {
    timestamps: true,
});

export default mongoose.model("User", userSchema);