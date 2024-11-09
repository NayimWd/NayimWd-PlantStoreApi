import { Request, Response, NextFunction } from "express";
import redis from "../config/redisClient";

export const cacheMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const queryParams = req.query;
    const resource = req.baseUrl;
  
    // Construct cache key
    const queryKey = Object.keys(queryParams)
      .sort() // Sort to ensure consistent query order
      .map((key) => `${key}=${queryParams[key]}`)
      .join("&");
    const cachedKey = id ? `${resource}:${id}` : `${resource}?${queryKey}`;
  
    try {
      const cachedData = await redis.get(cachedKey);
  
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
  
      // Save the cache key in res.locals for setting it after the DB operation
      res.locals.cacheKey = cachedKey;
      next();
    } catch (error) {
      console.error('Redis error:', error);
      next(); // Continue even if Redis is unavailable
    }
  };
