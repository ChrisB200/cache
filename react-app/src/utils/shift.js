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
};

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
};

export function isToday (day) {
  const today = new Date()
  return (
    today.getFullYear() === day.getFullYear() &&
    today.getMonth() === day.getMonth() &&
    today.getDate() === day.getDate()
  );
};

export function isSelected(selectedDay, day) {
  if (selectedDay == null) {
    return false;
  }

  return (
    selectedDay.getFullYear() === day.getFullYear() &&
    selectedDay.getMonth() === day.getMonth() &&
    selectedDay.getDate() === day.getDate()
  );
};
