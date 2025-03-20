export function dateToStr(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
  const day = String(date.getDate()).padStart(2, '0'); // Ensure day is always two digits

  return `${year}-${month}-${day}`;
}

