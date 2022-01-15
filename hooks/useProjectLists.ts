import { Project } from "@prisma/client";
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

function useProjectLists() {
  const { data: projectLists, error } = useSWR<
    { data: Project[] },
    Error & { status: number }
  >("/api/projects", fetcher);
  return { projectLists, error, isLoading: !error && !projectLists };
}

export default useProjectLists;
