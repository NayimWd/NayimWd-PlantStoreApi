import redis from "../config/redisClient";

export const invalidateCache = async (resource: string, id?: string) => {
    const cacheKey = id ? `${resource}:${id}` : `${resource}:*`;
  
    try {
      // Use wildcard for bulk invalidation when no specific ID
      const keys = id ? [cacheKey] : await redis.keys(cacheKey);
  
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`Cache invalidated for key(s): ${keys.join(', ')}`);
      } else {
        console.log('No cache keys found to invalidate.');
      }
    } catch (error) {
      console.error(`Failed to invalidate cache for key: ${cacheKey}`, error);
    }
  };