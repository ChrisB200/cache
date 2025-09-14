import { useEffect, useState } from "react";
import { useDate } from "./DateContext";
import { motion } from "motion/react";
import { useShifts } from "@/contexts/ShiftContext";
import type { Shift } from "@/types/shifts";

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function isShiftDate(shifts: Shift[], day: Date) {
  return shifts.some((shift) => {
    const shiftDate = new Date(shift.date);
    if (
      shiftDate.getFullYear() === day.getFullYear() &&
      shiftDate.getMonth() === day.getMonth() &&
      shiftDate.getDate() === day.getDate()
    )
      return shift;
  });
}

export function isToday(day: Date) {
  const today = new Date();
  return (
    today.getFullYear() === day.getFullYear() &&
    today.getMonth() === day.getMonth() &&
    today.getDate() === day.getDate()
  );
}

export function isSelected(selectedDay: Date | null, day: Date) {
  if (selectedDay == null) {
    return false;
  }

  return (
    selectedDay.getFullYear() === day.getFullYear() &&
    selectedDay.getMonth() === day.getMonth() &&
    selectedDay.getDate() === day.getDate()
  );
}

function WorkCalendar() {
  const [days, setDays] = useState<Date[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const { date, getMonth, getYear } = useDate();
  const { shifts, fetchMonth } = useShifts();

  const handleDateClick = (day: Date) => {
    if (day.getMonth() === date.getMonth()) {
      setSelectedDay(day);
    }
  };

  const generateCalendar = (year: number, month: number) => {
    const startDate = new Date(year, month, 1);
    const startDay = startDate.getDay();
    const monthDays = daysInMonth(year, month);
    const prevMonthDays = new Date(year, month, 0).getDate();
    const daysFromPrevMonth = startDay;

    const dates = [];

    // previous month's days
    for (let i = daysFromPrevMonth; i > 0; i--) {
      dates.push(new Date(year, month - 1, prevMonthDays - i + 1));
    }

    // current month's days
    for (let i = 1; i <= monthDays; i++) {
      dates.push(new Date(year, month, i));
    }

    // next month's days
    const totalDays = dates.length;
    const totalCells = Math.ceil(totalDays / 7) * 7;
    const daysToNextMonth = totalCells - totalDays;

    for (let i = 1; i <= daysToNextMonth; i++) {
      dates.push(new Date(year, month + 1, i));
    }

    setDays(dates);
  };

  useEffect(() => {
    generateCalendar(getYear(), getMonth());
    fetchMonth(date);
  }, [date]);

  const dayClasses = (day: Date) => {
    const conditions = {
      outside: day.getMonth() !== date.getMonth(),
      shift: isShiftDate(shifts, day),
      today: isToday(day),
      selected: isSelected(selectedDay, day),
    };

    let classes = "day";

    if (conditions.outside) classes = `${classes} text-muted-foreground`;

    if (conditions.shift) classes = `${classes} shift`;

    if (conditions.today) classes = `${classes} today`;

    if (conditions.selected) classes = `${classes} selected`;

    return classes;
  };

  return (
    <div className="overflow-hidden">
      {/* Use `key` so motion knows it’s a new grid when month/year changes */}
      <motion.div
        layout
        key={`${getYear()}-${getMonth()}`}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative grid grid-cols-7 text-center gap-x-4 gap-y-9 mb-3"
      >
        <p>Sun</p>
        <p>Mon</p>
        <p>Tue</p>
        <p>Wed</p>
        <p>Thu</p>
        <p>Fri</p>
        <p>Sat</p>
        {days.map((day, index) => (
          <p
            onClick={() => handleDateClick(day)}
            className={dayClasses(day)}
            key={day.toISOString() + "-" + index}
          >
            {day.getDate()}
          </p>
        ))}
      </motion.div>
    </div>
  );
}

export default WorkCalendar;
