import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error('REDIS_URL is not defined in the environment variables.');
}

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null, // Disable built-in retry to handle reconnect explicitly
    enableReadyCheck: true,     // Ensures Redis is ready before accepting commands
    reconnectOnError: (err) => {
      console.error('Redis connection error:', err);
      return true; // Automatically reconnect
    },
  });
  
  redis.on('connect', () => console.log('Connected to Redis'));
  redis.on('error', (err) => console.error('Redis error:', err));
  redis.on('close', () => console.warn('Redis connection closed'));
  redis.on('reconnecting', () => console.log('Reconnecting to Redis...'));

export default redis;