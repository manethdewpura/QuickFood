import Receipt from "../models/reciept.model.js";

export const createReceipt = async (
  orderId,
  amount,
  currency,
  status,
  transactionId
) => {
  try {
    const receipt = new Receipt({
      orderId,
      amount,
      currency,
      status,
      transactionId,
    });
    await receipt.save();
    return receipt;
  } catch (error) {
    console.error("Error creating receipt:", error.message);
    throw error;
  }
};

export const getReceiptById = async (receiptId) => {
  try {
    const receipt = await Receipt.findById(receiptId);
    if (!receipt) {
      throw new Error("Receipt not found");
    }
    return receipt;
  } catch (error) {
    console.error("Error fetching receipt:", error.message);
    throw error;
  }
};
