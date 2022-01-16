import { Todo } from "@prisma/client";
import useSWR from "swr";
import urlForTodosWithDateRange from "../helpers/urlForTodosWithDateRange";
// import { URLSearchParams } from "url";

export type DataType = { data: Todo[] };

const fetcher = async (url: string) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    console.log("res not ok");
    const errorObj = new Error() as Error & { status: number };
    const error = await res.json();
    errorObj.message = error.error;
    errorObj.status = error.status;
    throw errorObj;
  }
  return res.json();
};

function useTodosWithDateRange(startDueDate: Date, endDueDate: Date) {
  const url = urlForTodosWithDateRange(startDueDate, endDueDate);
  console.log("url with date range", url);
  const { data: todos, error } = useSWR<DataType, Error & { status: number }>(
    url,
    fetcher
  );
  return { todos, error, isLoading: !error && !todos, url };
}

export default useTodosWithDateRange;
