export function combineShifts(shifts) {
  const combined = [...shifts.timecard];

  shifts.schedule.forEach((scheduleShift) => {
    if (
      !combined.some(
        (timecardShift) => timecardShift.date === scheduleShift.date,
      )
    ) {
      combined.push(scheduleShift);
    }
  });

  return combined.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function sortShifts(data) {
  const timecardShifts = data.filter((shift) => shift.type === "Timecard");
  const scheduleShifts = data.filter((shift) => shift.type === "Schedule");

  return {
    timecard: timecardShifts,
    schedule: scheduleShifts,
  };
}

export function isPayslipDate(payslips, day) {
  return payslips.some((payslip) => {
    const payslipDate = new Date(payslip.date);
    return (
      payslipDate.getFullYear() === day.getFullYear() &&
      payslipDate.getMonth() === day.getMonth() &&
      payslipDate.getDate() === day.getDate()
    );
  });
}

export function isShiftDate(shifts, day) {
  const allShifts = shifts.timecard.concat(shifts.schedule);
  return allShifts.some((shift) => {
    const shiftDate = new Date(shift.date);
    return (
      shiftDate.getFullYear() === day.getFullYear() &&
      shiftDate.getMonth() === day.getMonth() &&
      shiftDate.getDate() === day.getDate()
    );
  });
}

export function isToday(day) {
  const today = new Date();
  return (
    today.getFullYear() === day.getFullYear() &&
    today.getMonth() === day.getMonth() &&
    today.getDate() === day.getDate()
  );
}

export function isSelected(selectedDay, day) {
  if (selectedDay == null) {
    return false;
  }

  return (
    selectedDay.getFullYear() === day.getFullYear() &&
    selectedDay.getMonth() === day.getMonth() &&
    selectedDay.getDate() === day.getDate()
  );
}

export function calculateTimeLeft(shiftDate) {
  const now = new Date();
  const difference = new Date(shiftDate) - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export function combineDateAndTime(date, time) {
  const combinedDate = new Date(date);
  const [startHours, startMinutes] = time.split(":").map(Number);

  combinedDate.setHours(startHours, startMinutes);

  return combinedDate;
}

export function getNextShift(shifts) {
  const today = new Date();
  const futureShifts = shifts?.schedule.filter(
    (shift) => combineDateAndTime(new Date(shift.date), shift.start) >= today,
  );

  if (futureShifts.length > 0) {
    return futureShifts[0];
  }

  return null;
}

export function mostRecentDate(objects, property) {
  return new Date(
    Math.max.apply(
      null,
      objects.map((e) => {
        return new Date(e[property]);
      }),
    ),
  );
}

export function mostRecentObject(objects, property) {
  const mostRecent = mostRecentDate(objects, property); 
  return objects.find((e) => {
    return new Date(e[property]).getTime() === mostRecent.getTime(); 
  });
}

