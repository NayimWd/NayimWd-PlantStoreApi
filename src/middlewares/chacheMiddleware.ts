import { Request, Response, NextFunction } from "express";
import redis from "../config/redisClient";
import { asyncHandler } from "../utils/asyncHandler";

export const cache = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // set url as cache key
    const key = req.originalUrl;

    const cachedData = await redis.get(key);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    next();
  }
);
