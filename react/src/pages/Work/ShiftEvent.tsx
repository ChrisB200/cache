import type { Shift } from "@/types/shifts";
import { upperFirstChar } from "@/utils/text";

interface ShiftEventProps {
  shift: Shift;
}

function ShiftEvent({ shift }: ShiftEventProps) {
  const date = new Date(shift.date);

  const shortDayName = date.toLocaleDateString("en-GB", {
    weekday: "short",
  });

  const shortDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <div className="flex">
      <div>
        <p>{shortDayName}</p>
        <p>{shortDate}</p>
      </div>
      <div>
        <p>15:43 - 00:12</p>
        <p>{upperFirstChar(shift.type)}</p>
      </div>
      <div>
        <p></p>
        <p>£{(shift.hours * shift.rate).toFixed(2)}</p>
      </div>
    </div>
  );
}

export default ShiftEvent;
