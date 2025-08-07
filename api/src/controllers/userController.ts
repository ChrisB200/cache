import { RequestHandler } from "express";
import { db } from "../config/database";
import { validateSetupCredentials } from "../services/userService";
import AppError from "../utils/appError";

const setupFiveGuys: RequestHandler = async (req, res) => {
  const {
    workplace,
    open,
    close,
    fgp_username,
    fgp_password,
    sd_username,
    sd_password,
  } = validateSetupCredentials(req.body);

  const user = req.session.user!;

  const store = await db
    .insertInto("stores")
    .values({ open, close, workplace, user_id: user.id })
    .returningAll()
    .executeTakeFirst();

  const fgp_credentials = await db
    .insertInto("credentials")
    .values({
      username: fgp_username,
      password: fgp_password,
      user_id: user.id,
      workplace,
      service: "FGP",
    })
    .returningAll()
    .executeTakeFirst();

  const sd_credentials = await db
    .insertInto("credentials")
    .values({
      username: sd_username,
      password: sd_password,
      user_id: user.id,
      workplace,
      service: "SDWORX",
    })
    .returningAll()
    .executeTakeFirst();

  if (!store || !fgp_credentials || !sd_credentials)
    throw new AppError("Error occured creating records", 500);

  res.status(200).json("success");
};

export { setupFiveGuys };
