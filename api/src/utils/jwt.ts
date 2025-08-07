import jwt from "jsonwebtoken";
import config from "../config/constants";
import { Request } from "express";

export const generateToken = (data: any, expires = 3600000) => {
  const expiry = Date.now() + expires;
  const newData = { ...data, expiry };
  const token = jwt.sign(newData, config.SUPABASE_JWT_SECRET_KEY);
  return token;
};

export function validateToken<T>(token: string): T | null {
  try {
    const data = jwt.verify(token, config.SUPABASE_JWT_SECRET_KEY) as T;
    return data;
  } catch {
    return null;
  }
}

export const getAuthorizationToken = (req: Request) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }

  const token = auth.split(" ")[1];
  if (!token) {
    return null;
  }

  return token;
};
