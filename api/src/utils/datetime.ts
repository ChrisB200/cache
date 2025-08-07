import { TimeString } from "../types/dates";

export function convertTimeToDate(timeString: TimeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0,
    0,
  );
}
