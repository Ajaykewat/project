import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const expenseSchema = new mongoose.Schema({
  amount: Number,
  paymentMode: String,
  onlinePaymentMethod: String,
  upiProvider: String,
  cardType: String,
  description: String,
  transactionType: String,
  createdAt: { type: Date, default: Date.now },
});

const Expencess = mongoose.model("Expencess", expenseSchema);

export default Expencess;
