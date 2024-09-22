import React, { useState, useEffect } from "react";
import { usePayslips, useShifts } from "../hooks/contexts";
import styles from "../styles/Calendar.module.css";
import {
  isPayslipDate,
  isShiftDate,
  isToday,
  isSelected,
} from "../utils/shift";

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function Calendar({ currentDate, setCurrentDate, onDateSelect }) {
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const { payslips } = usePayslips();
  const { shifts } = useShifts();

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
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={handlePrev} className={styles.prev}>
          &#60;
        </button>
        <div>
          <p className={styles.year}>{currentDate.getFullYear()}</p>
          <h2 className={styles.month}>
            {currentDate.toLocaleString("default", { month: "long" })}
          </h2>
        </div>
        <button onClick={handleNext} className={styles.next}>
          &#62;
        </button>
      </div>
      <div className={styles.dates}>
        <p className={styles.weekday}>Sun</p>
        <p className={styles.weekday}>Mon</p>
        <p className={styles.weekday}>Tue</p>
        <p className={styles.weekday}>Wed</p>
        <p className={styles.weekday}>Thu</p>
        <p className={styles.weekday}>Fri</p>
        <p className={styles.weekday}>Sat</p>
        {days.map((day, index) => (
          <p
            key={index}
            onClick={() => {
              handleDateClick(day);
            }}
            className={`
                ${styles.day} 
                ${isPayslipDate(payslips, day) ? styles.payslip : ""}
                ${isShiftDate(shifts, day) ? styles.onshift : ""}
                ${isToday(day) ? styles.today : ""}
                ${isSelected(selectedDay, day) ? styles.selected : ""}
                ${day.getMonth() !== currentDate.getMonth() ? styles.outside : ""}
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
