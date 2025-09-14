export type ShiftCategory = "holiday" | "work";

export type ShiftType = "schedule" | "timecard";

export interface Shift {
  category: ShiftCategory;
  date: Date;
  finish: Date;
  start: Date;
  id: string;
  type: ShiftType;
  userId: string;
  hours: number;
  rate: number;
}

export interface GetShiftsParams {
  month?: number;
  year?: number;
  type?: ShiftType;
  category?: ShiftCategory;
}

export type GetShifts = GetShiftsParams | null | {};
