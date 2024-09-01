import React, { useState, useEffect } from "react";
import "../../index.css";
import "./Work.css";
import httpClient, { BASE_API_URL } from "../../utilities/httpClient";

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function Shift(props) {
  const shiftDate = new Date(props.shift.date);
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
              {props.shift.start} - {props.shift.end}
            </p>
          </strong>

          <p>{props.shift.type}</p>
        </div>
      </div>
      <div className="shift-hours">
        <p>{props.shift.hours.toFixed(2)}hrs</p>
      </div>
    </div>
  );
}

function Calendar(props) {
  const [days, setDays] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const isPayslipDate = (day) => {
    return props.payslips.some((payslip) => {
      const payslipDate = new Date(payslip.date);
      return (
        payslipDate.getFullYear() === day.getFullYear() &&
        payslipDate.getMonth() === day.getMonth() &&
        payslipDate.getDate() === day.getDate()
      );
    });
  };

  const isShiftDate = (day) => {
    const all = props.shifts.timecard.concat(props.shifts.schedule);
    return all.some((shift) => {
      const shiftDate = new Date(shift.date);
      return (
        shiftDate.getFullYear() === day.getFullYear() &&
        shiftDate.getMonth() === day.getMonth() &&
        shiftDate.getDate() === day.getDate()
      );
    });
  };

  const isToday = (day) => {
    return (
      today.getFullYear() === day.getFullYear() &&
      today.getMonth() === day.getMonth() &&
      today.getDate() === day.getDate()
    );
  };

  const combineShifts = () => {
    const all = props.shifts.timecard;
    props.shifts.schedule.forEach((schedule_shift) => {
      let shouldAdd = true;
      props.shifts.timecard.forEach((timecard_shift) => {
        if (schedule_shift.date === timecard_shift.date) {
          shouldAdd = false;
        }
      });
      if (shouldAdd === true) {
        all.push(schedule_shift);
      }
    });

    const sorted = all.sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    return sorted;
  };

  useEffect(() => {
    const generateCalendar = (year, month) => {
      const startDate = new Date(year, month, 1);
      const startDay = startDate.getDay();
      const monthDays = daysInMonth(year, month);
      const prevMonthDays = new Date(year, month, 0).getDate();
      const daysFromPrevMonth = startDay;

      const dates = [];

      // Previous month's days
      for (let i = daysFromPrevMonth; i > 0; i--) {
        dates.push(new Date(year, month - 1, prevMonthDays - i + 1));
      }

      // Current month's days
      for (let i = 1; i <= monthDays; i++) {
        dates.push(new Date(year, month, i));
      }

      // Next month's days
      const totalDays = dates.length;
      const totalCells = Math.ceil(totalDays / 7) * 7;
      const daysToNextMonth = totalCells - totalDays;

      for (let i = 1; i <= daysToNextMonth; i++) {
        dates.push(new Date(year, month + 1, i));
      }

      return dates;
    };

    setDays(
      generateCalendar(currentDate.getFullYear(), currentDate.getMonth()),
    );
  }, [currentDate]);

  return (
    <div className="sidebar">
      <div className="calendar-container">
        <div className="calendar">
          <div className="calendar-header">
            <button onClick={handlePrev} className="prev">
              &#60;
            </button>
            <div>
              <p className="year">{currentDate.getFullYear()}</p>
              <h2 className="calendar-month">
                {currentDate.toLocaleString("default", { month: "long" })}
              </h2>
            </div>
            <button onClick={handleNext} className="next">
              &#62;
            </button>
          </div>
          <div className="calendar-dates">
            <p>Sun</p>
            <p>Mon</p>
            <p>Tue</p>
            <p>Wed</p>
            <p>Thu</p>
            <p>Fri</p>
            <p>Sat</p>
            {days.map((day, index) => (
              <p
                key={index}
                className={`
                calendar-day 
                ${isPayslipDate(day) ? "payslip" : ""}
                ${isShiftDate(day) ? "shift-on" : ""}
                ${isToday(day) ? "today" : ""}
                ${day.getMonth() !== currentDate.getMonth() ? "outside-month" : ""}
                `}
              >
                {day.getDate()}
              </p>
            ))}
          </div>
          <div className="shifts-container">
            <div className="shifts">
              {combineShifts().map((shift, index) => {
                const shiftDate = new Date(shift.date);

                if (shiftDate.getMonth() === currentDate.getMonth()) {
                  return <Shift key={index} shift={shift} />;
                }

                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
