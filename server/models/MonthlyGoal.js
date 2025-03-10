import mongoose from "mongoose";

const monthlyGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    achieved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MonthlyGoal = mongoose.model("MonthlyGoal", monthlyGoalSchema);

export default MonthlyGoal;
