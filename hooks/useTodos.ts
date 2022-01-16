import { Todo } from "@prisma/client";
import useSWR from "swr";

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

function useTodos(projectId: string) {
  let url = `/api/projects/${projectId}/todos`;
  const { data: todos, error } = useSWR<
    { data: Todo[] },
    Error & { status: number }
  >(url, fetcher);
  return { todos, error, isLoading: !error && !todos };
}

export default useTodos;
