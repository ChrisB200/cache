import { RequestHandler } from "express";
import AppError from "../utils/appError";

const protectedRoute: RequestHandler = (req, res, next) => {
  if (req.session.user) {
    return next();
  }

  throw new AppError("Unauthorised access", 401, "UNAUTHORISED");
};

export default protectedRoute;
