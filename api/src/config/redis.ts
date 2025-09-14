import { createClient } from "redis";
import env from "./constants";

console.log(env.REDIS_URL);
export const redisClient = createClient({ url: env.REDIS_URL });
redisClient.on("error", (err) => console.error("Redis Client Error", err));

export async function connectRedisClients() {
  await redisClient.connect();
}
