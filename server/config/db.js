import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
console.log("process.env.MONGODB_URI", process.env.MONGODB_URI);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://ajaykewatofficial:zuXjviYsyhIFJHL8@cluster0.yh9ot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
