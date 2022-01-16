import urlForTodosWithDateRange from "./urlForTodosWithDateRange";

export default function urlForTodosOfToday() {
  const startDueDate = new Date();
  startDueDate.setHours(0, 0, 0, 0);
  const endDueDate = new Date();
  endDueDate.setHours(23, 59, 59, 999);

  return urlForTodosWithDateRange(startDueDate, endDueDate);
}
