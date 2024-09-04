import { useState, useEffect, useRef } from "react";
import Calendar from "./Calendar";
import "../../index.css";
import "./Work.css";
import { PayslipProvider } from "../../contexts/PayslipContext";
import { ShiftProvider } from "../../contexts/ShiftContext";
import { usePayslips, useShifts } from "../../hooks/contexts";
import { combineShifts } from "../../utils/shift";
import Navbar from "../Reusable/Navbar/Navbar";
import { ShiftCard } from "./Card";
import { fetchForecastedShifts } from "../../api/work";

function Shift({ shift, isSelected, onClick }) {
  const shiftRef = useRef(null);
  const shiftDate = new Date(shift.date);
  const formattedDate = shiftDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });

  useEffect(() => {
    // Scroll into view if this shift is selected
    if (isSelected && shiftRef.current) {
      shiftRef.current.classList.add("selected-shift");
      // Step 2: Use requestAnimationFrame to ensure the scroll happens after rendering
      requestAnimationFrame(() => {
        shiftRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
    if (!isSelected) {
      shiftRef.current.classList.remove("selected-shift");
    }
  }, [isSelected]);

  return (
    <div className="shift-container" ref={shiftRef} onClick={onClick}>
      <div className="shift-info">
        <div className="shift-date">
          <p className="shift-day">
            {shiftDate.toLocaleDateString("default", { weekday: "short" })}
          </p>
          <p className="shift-short">{formattedDate}</p>
        </div>
        <div className="shift-details">
          <strong>
            <p>
              {shift.start} - {shift.end}
            </p>
          </strong>
          <p>{shift.type}</p>
        </div>
      </div>
      <div className="shift-hours">
        <p className="cash">£{(shift.hours * shift.rate).toFixed(2)}</p>
        <p className="grayed">{shift.hours.toFixed(2)}</p>
      </div>
    </div>
  );
}

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
    <div className="sidebar">
      <Calendar
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        onDateSelect={handleDateSelect}
      />
      <div className="shifts-container">
        <div className="shifts">
          {error != null ? (
            <p className="shifts-error">{error}</p>
          ) : (
            combineShifts(shifts).map((shift, index) => {
              const shiftDate = new Date(shift.date);

              if (
                shiftDate.getMonth() === currentDate.getMonth() &&
                shiftDate.getFullYear() === currentDate.getFullYear()
              ) {
                return (
                  <Shift
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



function Work() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [recentShifts, setRecentShifts] = useState(null);

  const loadRecent = async () => {
    try {
      const data = await fetchForecastedShifts();
      setRecentShifts(data)
    } catch {
      console.log ("hey");
    } finally {
    }
  }

  useEffect(() => {
    loadRecent();
  }, [])

  return (
    <PayslipProvider>
      <ShiftProvider>
        <div className="content">
          <Navbar></Navbar>
          <ShiftCard></ShiftCard>

          <Sidebar currentDate={currentDate} setCurrentDate={setCurrentDate} />
        </div>
      </ShiftProvider>
    </PayslipProvider>
  );
}

export default Work;
