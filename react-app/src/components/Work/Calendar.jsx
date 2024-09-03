import React, { useState, useEffect, useRef } from "react";
import { usePayslips, useShifts } from "../../hooks/contexts";
import "../../index.css";
import "./Work.css";

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function Calendar({ currentDate, setCurrentDate, onDateSelect }) {
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const { payslips } = usePayslips();
  const { shifts } = useShifts();
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

  const handleDateClick = (day) => {
    if (day.getMonth() === currentDate.getMonth()) {
      setSelectedDay(day);
      onDateSelect(day);
    }
  }

  const isPayslipDate = (day) => {
    return payslips.some((payslip) => {
      const payslipDate = new Date(payslip.date);
      return (
        payslipDate.getFullYear() === day.getFullYear() &&
        payslipDate.getMonth() === day.getMonth() &&
        payslipDate.getDate() === day.getDate()
      );
    });
  };

  const isShiftDate = (day) => {
    const allShifts = shifts.timecard.concat(shifts.schedule);
    return allShifts.some((shift) => {
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


  const isSelected = (day) => {
    if (selectedDay == null) {
      return false;
    }

    return (
      selectedDay.getFullYear() === day.getFullYear() &&
      selectedDay.getMonth() === day.getMonth() &&
      selectedDay.getDate() === day.getDate()
    );

  }

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
            onClick={() => {handleDateClick(day)}}
            className={`
                calendar-day 
                ${isPayslipDate(day) ? "payslip" : ""}
                ${isShiftDate(day) ? "shift-on" : ""}
                ${isToday(day) ? "today" : ""}
                ${isSelected(day) ? "selected-day" : ""}
                ${day.getMonth() !== currentDate.getMonth() ? "outside-month" : ""}
                `}
          >
            {day.getDate()}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
