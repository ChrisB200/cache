import { useState } from "react";
import Calendar from "../components/Calendar";
import { useShifts } from "../hooks/contexts"
import ShiftPanel from "../components/ShiftPanel";
import { combineShifts } from "../utils/shift";
import styles from "../styles/Sidebar.module.css";

function Sidebar({ currentDate, setCurrentDate }) {
  const { shifts, isLoading, error, setShifts } = useShifts();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const isSelected = (date) => {
    if (
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getDate() === selectedDate.getDate()
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className={styles.sidebar}>
      <Calendar
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        onDateSelect={handleDateSelect}
      />
      <div className={styles.container}>
        <div className={styles.shifts}>
          {error != null ? (
            <p className="error">{error}</p>
          ) : (
            combineShifts(shifts).map((shift, index) => {
              const shiftDate = new Date(shift.date);

              if (
                shiftDate.getMonth() === currentDate.getMonth() &&
                shiftDate.getFullYear() === currentDate.getFullYear()
              ) {
                return (
                  <ShiftPanel
                    key={index}
                    shift={shift}
                    isSelected={isSelected(shiftDate)}
                    onClick={() => {
                      handleDateSelect(shiftDate);
                    }}
                  />
                );
              }

              return null;
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
