import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import "../../index.css";
import "./Work.css";
import { PayslipProvider } from "../../contexts/PayslipContext";
import { ShiftProvider } from "../../contexts/ShiftContext";
import { usePayslips, useShifts } from "../../hooks/contexts";
import { combineShifts } from "../../utils/shift";

function Shift({ shift }) {
  const shiftDate = new Date(shift.date);
  const formattedDate = shiftDate.toLocaleDateString("default", {
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <div className="shift-container">
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
  const {shifts, isLoading, error, setShifts} = useShifts();
  console.log(error);
  

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <Calendar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
        <div className="shifts-container">
          <div className="shifts">
            {error != null ? (
              <p className = "shifts-error">{error}</p>
            ) : 
              combineShifts(shifts).map((shift, index) => {
              const shiftDate = new Date(shift.date);

              if (
                shiftDate.getMonth() === currentDate.getMonth() &&
                shiftDate.getFullYear() === currentDate.getFullYear()
              ) {
                return <Shift key={index} shift={shift} />;
              }

              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Work() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <PayslipProvider>
      <ShiftProvider>
        <Sidebar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
      </ShiftProvider>
    </PayslipProvider>
  );
}

export default Work;
