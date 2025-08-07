export function setTime({ hours = 0, mins = 0, seconds = 0 }) {
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(mins);
  date.setSeconds(seconds);

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${hh}:${mm}`;
}
