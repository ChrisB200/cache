import { db } from "../config/database";
import AppError from "../utils/appError";
import { RequestHandler } from "express";

const completeSignup: RequestHandler = async (req, res) => {
  const { username, nickname } = req.body;
  const user = req.session.user!;

  if (!username || !nickname)
    throw new AppError("Missing fields", 400, "MISSING_FIELDS");

  const username_exists = await db
    .selectFrom("users")
    .where("username", "=", username)
    .executeTakeFirst();

  if (username_exists)
    throw new AppError("Username is already in use", 409, "USERNAME_EXISTS");

  await db
    .updateTable("users")
    .set({ username, nickname })
    .where("id", "=", user.id)
    .executeTakeFirst();

  res.status(200).json({ message: "success" });
};

const isAuthenticated: RequestHandler = async (req, res) => {
  res.status(200).json(req.session.user);
};

export { completeSignup, isAuthenticated };
