import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/email.js";
import Expencess from "../models/Expencess.js";
// import { sendNotification } from "../utils/notifications.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationToken = crypto.randomBytes(20).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
    });

    // await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for verification.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email first" });
    }

    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    //await sendPasswordResetEmail(email, resetToken);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    alert("Password Updated", "Your password has been successfully updated.");

    // if (user.onesignalPlayerId) {
    //   alert("Password Updated", "Your password has been successfully updated.");
    //   // await sendNotification(
    //   //   user.onesignalPlayerId,
    //   //   "Password Updated",
    //   //   "Your password has been successfully updated."
    //   // );
    // }

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOneSignalId = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // user.onesignalPlayerId = req.body.playerId;
    await user.save();

    res.json({ message: "OneSignal ID updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const addexpencess = async (req, res) => {
  try {
    console.log("req.body", JSON.stringify(req.body));
    const expense = new Expencess(req.body);
    await expense.save();
    res.status(201).json({ message: "Expense saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getexpencess = async (req, res) => {
  try {
    const expenses = await Expencess.find({}).sort({ createdAt: -1 });
    console.log("expenses", JSON.stringify(expenses));
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
