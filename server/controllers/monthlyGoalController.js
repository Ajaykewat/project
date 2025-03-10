import MonthlyGoal from "../models/MonthlyGoal.js";
import { sendNotification } from "../utils/notifications.js";

export const createMonthlyGoal = async (req, res) => {
  try {
    const { amount, month, year } = req.body;

    const existingGoal = await MonthlyGoal.findOne({
      user: req.user._id,
      month,
      year,
    });

    if (existingGoal) {
      return res
        .status(400)
        .json({ message: "Goal for this month already exists" });
    }

    const goal = await MonthlyGoal.create({
      user: req.user._id,
      amount,
      month,
      year,
    });

    // if (req.user.onesignalPlayerId) {
    //   //   await sendNotification(
    //   //     req.user.onesignalPlayerId,
    //   //     "Monthly Goal Set",
    //   //     `Your monthly goal of ₹${amount} has been set for ${month} ${year}`
    //   //   );
    // }

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentMonthGoal = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.toLocaleString("default", { month: "long" });
    const currentYear = now.getFullYear();

    const goal = await MonthlyGoal.findOne({
      user: req.user._id,
      month: currentMonth,
      year: currentYear,
    });

    if (!goal) {
      return res
        .status(404)
        .json({ message: "No goal found for current month" });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMonthlyGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    const { id } = req.params;

    const goal = await MonthlyGoal.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.amount = amount;
    await goal.save();

    // if (req.user.onesignalPlayerId) {
    //   //   await sendNotification(
    //   //     req.user.onesignalPlayerId,
    //   //     'Monthly Goal Updated',
    //   //     `Your monthly goal has been updated to ₹${amount}`
    //   //   );
    // }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllGoals = async (req, res) => {
  try {
    const goals = await MonthlyGoal.find({ user: req.user._id }).sort({
      year: -1,
      month: -1,
    });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
