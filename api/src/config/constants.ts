// config.ts
import dotenv from "dotenv";
dotenv.config();

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable "${key}" is not defined`);
  }
  return value;
}
const REDIS_HOST = getEnvVar("REDIS_HOST");
const REDIS_PASSWORD = getEnvVar("REDIS_PASSWORD");
const REDIS_PORT = getEnvVar("REDIS_PORT");
const REDIS_DATABASE = getEnvVar("REDIS_DATABASE");

const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_HOST: getEnvVar("DB_HOST"),
  DB_PASSWORD: getEnvVar("DB_PASSWORD"),
  DB_NAME: getEnvVar("DB_NAME"),
  DB_USERNAME: getEnvVar("DB_USERNAME"),
  DB_PORT: Number(getEnvVar("DB_PORT")),
  SUPABASE_URL: getEnvVar("SUPABASE_URL"),
  SUPABASE_ANON_KEY: getEnvVar("SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_KEY: getEnvVar("SUPABASE_SERVICE_KEY"),
  APP_SECRET_KEY: getEnvVar("APP_SECRET_KEY"),
  SESSION_SECRET_KEY: getEnvVar("SESSION_SECRET_KEY"),
  SUPABASE_JWT_SECRET_KEY: getEnvVar("SUPABASE_JWT_SECRET_KEY"),
  FRONTEND_URL: getEnvVar("FRONTEND_URL"),
  ENCRYPTION_KEY: getEnvVar("ENCRYPTION_KEY"),
  PLAID_CLIENT_ID: getEnvVar("PLAID_CLIENT_ID"),
  PLAID_SECRET: getEnvVar("PLAID_SECRET"),
  REDIS_URL: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DATABASE}`,
};

export default env;
