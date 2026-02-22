export function getDateString(baseDate, offsetDays = 0) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + offsetDays);

  return date.toISOString().split("T")[0];
}
