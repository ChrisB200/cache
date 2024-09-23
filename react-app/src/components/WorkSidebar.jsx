import { useState } from "react";
import Calendar from "../components/Calendar";
import { useShifts } from "../hooks/contexts";
import ShiftPanel from "../components/ShiftPanel";
import { combineShifts } from "../utils/shift";
import styles from "../styles/Sidebar.module.css";

function Sidebar({ currentDate, setCurrentDate, isSidebarOpen, toggleSidebar }) {
  const { shifts, error } = useShifts();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const isSelected = (date) => {
    return date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear() &&
           date.getDate() === selectedDate.getDate();
  };

  return (
    <div className={`${styles.sidebar} ${isSidebarOpen ? styles.expanded : styles.collapsed}`}>
      {isSidebarOpen ? (
        <>
          <button onClick={toggleSidebar} className={styles.toggleButton}>
            Hide Sidebar
          </button>
          <Calendar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onDateSelect={handleDateSelect}
          />
          <div className={styles.container}>
            <div className={styles.shifts}>
              {error ? (
                <p className="error">{error}</p>
              ) : (
                combineShifts(shifts).map((shift, index) => {
                  const shiftDate = new Date(shift.date);
                  if (shiftDate.getMonth() === currentDate.getMonth() &&
                      shiftDate.getFullYear() === currentDate.getFullYear()) {
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
        </>
      ) : (<></> 
      )}
    </div>
  );
}

export default Sidebar;

