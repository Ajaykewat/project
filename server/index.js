import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { encryptionMiddleware } from "./middleware/encryption.js";
import userRoutes from "./routes/userRoutes.js";
import monthlyGoalRoutes from "./routes/monthlyGoalRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
// app.use(encryptionMiddleware);

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/monthly-goals", monthlyGoalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
