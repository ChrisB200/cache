import { createClient } from "redis";

export const redisClient = createClient();
redisClient.on("error", (err) => console.error("Redis Client Error", err));

export const pubClient = redisClient.duplicate();
pubClient.on("error", (err) => console.error("Redis PubClient Error", err));

export const subClient = redisClient.duplicate();
subClient.on("error", (err) => console.error("Redis SubClient Error", err));

export async function connectRedisClients() {
  await redisClient.connect();
  await pubClient.connect();
  await subClient.connect();
}
