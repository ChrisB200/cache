import { useState, useEffect, useReducer } from "react";
import Calendar from "../components/Calendar";
import { useShifts, useSidebar, useUser } from "../hooks/contexts";
import ShiftPanel from "../components/ShiftPanel";
import { combineShifts } from "../utils/shift";
import styles from "../styles/Sidebar.module.css";
import calendar from "../assets/icons/calendar.png";
import ClickableIcon from "../components/ClickableIcon";
import useFetch from "../hooks/useFetch";
import { BASE_API_URL } from "../utils/constants";
import { dateToStr } from "../utils/helpers";
import shiftReducer from "../reducers/shiftReducer";

function Sidebar({ currentDate, setCurrentDate }) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { currentUser } = useUser();
  const [shifts, dispatch] = useReducer(shiftReducer, null);

  const { data: fetchedShifts, refetch: refetchShifts, error } = useFetch({
    url: `${BASE_API_URL}/shifts?month=${currentDate.getMonth()}&year=${currentDate.getFullYear()}`,
    method: "get",
    withCredentials: true,
    key: ["get", "shifts", "user", dateToStr(currentDate), currentUser?.id],
    cache: {
      enabled: true,
      ttl: 60
    }
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const isSelected = (date) => {
    return (
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getDate() === selectedDate.getDate()
    );
  };

  useEffect(() => {
    refetchShifts();
  }, [currentDate])

  useEffect(() => {
    if (fetchedShifts) {
      dispatch({ type: "SET_SHIFTS", payload: fetchedShifts})
    }
  }, [fetchedShifts])

  return (
    <div
      className={`${styles.sidebar} ${isSidebarOpen ? styles.expanded : styles.collapsed}`}
    >
      {isSidebarOpen ? (
        <>
          <ClickableIcon
            className={`${isSidebarOpen ? styles.cal : styles.hide}`}
            icon={calendar}
            onClick={toggleSidebar}
          />
          <div className={styles.space} />
          <Calendar
            shifts={shifts}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onDateSelect={handleDateSelect}
          />
          <div className={styles.container}>
            <div className={styles.shifts}>
              {error ? (
                <p className="error">{error}</p>
              ) : (
                fetchedShifts.map((shift, index) => {
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
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Sidebar;
