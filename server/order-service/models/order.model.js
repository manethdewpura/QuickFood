import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerLongitude: {
      type: Number,
      required: true,
    },
    customerLatitude: {
        type: Number,
        required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    recieptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reciept",
    },
    isOrderAccepted: {
        type: Boolean,
        default: false,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Ready", "Accepted", "Picked Up", "In Transit", "Delivered", "Cancelled"],
      default: "Pending",
    },
    deliveryPersonnelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
