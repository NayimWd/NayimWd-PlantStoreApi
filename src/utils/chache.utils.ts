import redis from "../config/redisClient";
import { asyncHandler } from "./asyncHandler";

export const invalidateCache = async (resource: string, id?: string) => {
    const cacheKey = id ? `${resource}:${id}` : resource;
    try {
      await redis.del(cacheKey);
      console.log(`Cache invalidated for key: ${cacheKey}`);
    } catch (error) {
      console.error(`Failed to invalidate cache for key: ${cacheKey}`, error);
    }
  };