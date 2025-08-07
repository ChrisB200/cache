import { ErrorRequestHandler } from "express";
import AppError from "../utils/appError";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error(err);
  if (err instanceof AppError) {
    return res.status(err?.status || 500).json({
      error: err.message,
      code: err.code,
    });
  } else {
    return res.status(500).json({
      error: "Internal server error",
      code: "INTERNAL_SERVER",
    });
  }
};
