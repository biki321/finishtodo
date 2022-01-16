export default function urlForTodosWithDateRange(
  startDueDate: Date,
  endDueDate: Date
) {
  const query = new URLSearchParams();
  query.set("startDueDate", startDueDate.toISOString());
  query.set("endDueDate", endDueDate.toISOString());
  const url = `/api/todos?${query.toString()}`;
  return url;
}
