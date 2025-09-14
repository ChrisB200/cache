import { RequestHandler } from "express";
import { db } from "../config/database";
import { ShiftCategory, ShiftType } from "../types/db";

function diffHours(start: string | Date, end: string | Date): number {
  const startDate = typeof start === "string" ? new Date(start) : start;
  const endDate = typeof end === "string" ? new Date(end) : end;
  const diffMs = endDate.getTime() - startDate.getTime(); // in ms
  const diffHours = diffMs / (1000 * 60 * 60); // convert to hours
  return diffHours;
}

const getShifts: RequestHandler = async (req, res) => {
  const user = req.session.user!;
  const { month, year, type, category } = req.query;

  // parse and check properly
  const parsedMonth =
    month !== undefined ? parseInt(month as string, 10) : null;
  const parsedYear = year !== undefined ? parseInt(year as string, 10) : null;

  const filters = {
    month: Number.isInteger(parsedMonth) ? parsedMonth : null,
    year: Number.isInteger(parsedYear) ? parsedYear : null,
    type: (type as ShiftType) ?? null,
    category: (category as ShiftCategory) ?? null,
  };

  let query = db.selectFrom("shifts").selectAll().where("userId", "=", user.id);

  if (filters.month !== null && filters.year !== null) {
    const startDate = new Date(filters.year, filters.month, 1);
    const endDate = new Date(filters.year, filters.month + 1, 1);

    query = query.where("date", ">=", startDate).where("date", "<", endDate);
  }

  if (filters.type) {
    query = query.where("type", "=", filters.type);
  }

  if (filters.category) {
    query = query.where("category", "=", filters.category);
  }

  const shifts = await query.execute();

  res.status(200).json(shifts);
};

const getShift: RequestHandler = async (req, res) => {
  const user = req.session.user!;
  const { id } = req.params;

  const shift = await db
    .selectFrom("shifts")
    .selectAll()
    .where("id", "=", id)
    .where("userId", "=", user.id)
    .executeTakeFirst();

  res.status(200).json(shift);
};

export { getShifts, getShift };
