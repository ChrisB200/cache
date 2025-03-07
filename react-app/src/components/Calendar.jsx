import React, { useState, useEffect } from "react";
import { usePayslips, useShifts } from "../hooks/contexts";
import styles from "../styles/Calendar.module.css";
import {
  isPayslipDate,
  isShiftDate,
  isToday,
  isSelected,
  isShiftHoliday,
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

  const dayEvents = (day) => {
    if (Object.keys(shifts).length == 0 || !payslips.length) {
      return styles.day;
    }

    const conditions = {
      holiday: isShiftHoliday(shifts, day),
      shift: isShiftDate(shifts, day),
      today: isToday(day),
      selected: isSelected(selectedDay, day),
      payslip: isPayslipDate(payslips, day),
      outside: day.getMonth() !== currentDate.getMonth(),
    };

    let classes = styles.day;

    if (conditions.outside) {
      classes = `${classes} ${styles.outside}`;
    }
    if (conditions.today) {
      classes = `${classes} ${styles.today}`;
    }
    if (conditions.selected) {
      classes = `${classes} ${styles.selected}`;
    }

    if (conditions.payslip) {
      if (conditions.shift) {
        classes = `${classes}  ${styles.shiftright} ${styles.payslipleft}`;
      } else if (conditions.holiday) {
        classes = `${classes} ${styles.payhol}`;
      } else {
        classes = `${classes} ${styles.payslip}`;
      }
    } else if (conditions.holiday) {
      classes = `${classes} ${styles.holiday}`;
    } else if (conditions.shift) {
      classes = `${classes} ${styles.onshift}`;
    }

    return classes;
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
  }, [currentDate, shifts, payslips]);

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
            className={`${dayEvents(day)}`}
          >
            {day.getDate()}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
