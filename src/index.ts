import express from "express";
import dotenv from "dotenv";
import connectDB from "./db";
import { app} from "./app/app";
import redis from "./config/redisClient";

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
    // redis connection
    await redis.ping();

    console.log('Redis is ready');

    app.listen(PORT, () => {
      console.log("Server running on port:", PORT);
    });
  } catch (err) {
    console.log("MongoDB connection failed!!", err);
    process.exit(1)
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await redis.quit(); // Gracefully close Redis connection
  process.exit(0);
});

startServer();
