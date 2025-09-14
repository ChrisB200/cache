import { useShifts } from "@/contexts/ShiftContext";
import ShiftEvent from "./ShiftEvent";

function WorkEvents() {
  const { shifts } = useShifts();
  return (
    <div>
      {shifts.map((shift) => {
        return <ShiftEvent shift={shift} />;
      })}
    </div>
  );
}

export default WorkEvents;
