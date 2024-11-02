import { Request, Response, NextFunction } from "express";
import redis from "../config/redisClient";
import { asyncHandler } from "../utils/asyncHandler";

export const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get id
  const { id } = req.params;
  // get query params
  const queryParams = req.query;
  // get cache key
  const key = req.baseUrl;

  // set cache key
  const cachedKey = id
    ? `${key}:${id}`
    : `${key}:${Object.keys(queryParams)
        .map((k) => `${k}=${queryParams[k]}`)
        .join("&")}`;

  try {
    const chachedData = await redis.get(cachedKey);

    if (chachedData) {
      return res.json(JSON.parse(chachedData));
    }
    res.locals.reidsKey = key;
    // if no key found
    next();
  } catch (error) {
    console.error("redis error", error);
  }
  next();
};
