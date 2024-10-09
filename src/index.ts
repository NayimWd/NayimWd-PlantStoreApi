import express from "express";
import dotenv from "dotenv";
import connectDB from "./db";
import { app} from "./app/app";

// dotenv configure
dotenv.config();


const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Database connection
const startServer = async () => {
  try {
    // Database connection
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server running on port:", PORT);
    });
  } catch (err) {
    console.log("MongoDB connection failed!!", err);
  }
};

startServer();
