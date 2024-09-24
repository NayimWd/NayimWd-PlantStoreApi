import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const appMiddleware = [
  express.json({
    limit: "16kb",
  }),
  express.static("public"),
  express.urlencoded({ extended: true, limit: "16kb" }),
  cookieParser(),
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
  helmet(),
  limiter,
];

export default appMiddleware;
