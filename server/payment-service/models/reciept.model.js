import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
      enum: [2, 0, -1, -2, -3], // 2 - success, 0 - pending, -1 - canceled, -2 - failed, -3 - chargedback
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Receipt", receiptSchema);
