import Redis from "ioredis";
import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError";
import { error } from "console";

dotenv.config();
// get redis url from env file
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in the environment variables.");
}

// connecting redis
const redis = new Redis(redisUrl);

redis.on("connect", () => console.log("Connected to Redis cloud"));
redis.on("error", () => console.log("Redis Error", error));

export default redis;
