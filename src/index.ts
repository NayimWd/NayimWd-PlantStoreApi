import express from "express";
import dotenv from "dotenv";
import connectDB from "./db";
import { app} from "./app/app";
// dotenv configure
dotenv.config({
  path: "./.env",
});


const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Database connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running on port:", PORT);
    });
  })
  .catch((err) => {
    console.log("Mongodb connection failed!!", err);
  });
