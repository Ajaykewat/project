import express from "express";
import { protect } from "../middleware/auth.js";
import {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  updateOneSignalId,
  addexpencess,
  getexpencess,
} from "../controllers/userController.js";

const router = express.Router();
console.log("called");
router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/onesignal", protect, updateOneSignalId);
router.post("/addexpencess", addexpencess);
router.post("/getexpencess", getexpencess);

export default router;
