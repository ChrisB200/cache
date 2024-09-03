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
