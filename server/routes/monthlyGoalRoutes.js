import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createMonthlyGoal,
  getCurrentMonthGoal,
  updateMonthlyGoal,
  getAllGoals,
} from "../controllers/monthlyGoalController.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createMonthlyGoal).get(getAllGoals);

router.get("/current", getCurrentMonthGoal);
router.put("/:id", updateMonthlyGoal);

export default router;
