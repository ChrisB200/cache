import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import "../../index.css";
import "./Work.css";
import httpClient from "../../utils/httpClient";
import { BASE_API_URL } from "../../utils/constants";
import { PayslipProvider } from "../../contexts/PayslipContext";
import { usePayslips } from "../../hooks/contexts";
import { combineShifts } from "../../utils/shift";

// Fetch data helper function
async function fetchData(url, func) {
  await httpClient.get(url).then((response) => {
    func(response.data);
  });
}
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

function Sidebar({ shifts, currentDate, setCurrentDate }) {
  const {payslips, isLoading, error} = usePayslips();

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <Calendar
          payslips={payslips}
          shifts={shifts}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
        <div className="shifts-container">
          <div className="shifts">
            {combineShifts(shifts).map((shift, index) => {
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
  const [shifts, setShifts] = useState({
    timecard: [],
    schedule: [],
  });

  const sortShifts = (data) => {
    const timecardShifts = data.filter((shift) => shift.type === "Timecard");
    const scheduleShifts = data.filter((shift) => shift.type === "Schedule");

    setShifts({
      timecard: timecardShifts,
      schedule: scheduleShifts,
    });
  };

  useEffect(() => {
    fetchData(`${BASE_API_URL}/work/shifts`, sortShifts);
  }, []);

  return (
    <PayslipProvider>
      <Sidebar
        shifts={shifts}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
    </PayslipProvider>
  );
}

export default Work;
