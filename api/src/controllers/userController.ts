import { RequestHandler } from "express";
import { db } from "../config/database";
import { validateSetupCredentials } from "../services/userService";
import AppError from "../utils/appError";

const setupFiveGuys: RequestHandler = async (req, res) => {
  const {
    workplace,
    rate,
    open,
    close,
    fgpUsername,
    fgpPassword,
    sdUsername,
    sdPassword,
  } = validateSetupCredentials(req.body);

  const user = req.session.user!;

  const store = await db
    .insertInto("stores")
    .values({ open, close, workplace, rate, userId: user.id })
    .returningAll()
    .executeTakeFirst();

  const fgpCredentials = await db
    .insertInto("credentials")
    .values({
      username: fgpUsername,
      password: fgpPassword,
      userId: user.id,
      workplace,
      service: "FGP",
    })
    .returningAll()
    .executeTakeFirst();

  const sdCredentials = await db
    .insertInto("credentials")
    .values({
      username: sdUsername,
      password: sdPassword,
      userId: user.id,
      workplace,
      service: "SDWORX",
    })
    .returningAll()
    .executeTakeFirst();

  if (!store || !fgpCredentials || !sdCredentials)
    throw new AppError("Error occured creating records", 500);

  res.status(200).json("success");
};

export { setupFiveGuys };
