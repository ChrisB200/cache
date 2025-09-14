import { getShiftsRequest } from "@/api/shiftRequests";
import type { ShiftCategory, ShiftType } from "@/types/shifts";
import { AppError } from "@/utils/errors";

type type = ShiftType | null;
type category = ShiftCategory | null;

const getShifts = async () => {
  const { data, ok } = await getShiftsRequest({});
  if (ok) return data;

  return AppError({ description: data.error });
};

const getShiftsByMonth = async (
  year: number,
  month: number,
  type: type = null,
  category: category = null,
) => {
  const { data, ok } = await getShiftsRequest({ year, month, type, category });
  if (ok) return data;

  throw new Error(data.error);
};

export { getShifts, getShiftsByMonth };
