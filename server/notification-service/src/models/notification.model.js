import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["order", "system", "promo"], required: true },
    read: { type: Boolean, default: false },
    link: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
