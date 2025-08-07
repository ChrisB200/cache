import { RequestHandler } from "express";
import { getAuthorizationToken, validateToken } from "../utils/jwt";
import { db } from "../config/database";
import { SupabaseJWT } from "../types/supabase";

const attachUser: RequestHandler = async (req, res, next) => {
  const accessToken = getAuthorizationToken(req);
  if (!accessToken) return next();

  const data = validateToken<SupabaseJWT>(accessToken);
  if (!data) {
    req.session.user = undefined;
    return next();
  }

  let user = await db
    .selectFrom("users")
    .selectAll()
    .where("auth_user_id", "=", data.sub)
    .executeTakeFirst();

  if (!user && data.sub) {
    user = await db
      .insertInto("users")
      .values({ auth_user_id: data.sub })
      .returningAll()
      .executeTakeFirst();
  }

  if (user) {
    req.session.user = user;
  } else {
    req.session.user = undefined;
  }

  return next();
};

export default attachUser;
