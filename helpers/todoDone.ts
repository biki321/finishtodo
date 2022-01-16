import { Project, Todo } from "@prisma/client";
import { ScopedMutator } from "swr/dist/types";
const todoDone = async (
  project: Project,
  todo: Todo,
  mutate: ScopedMutator<any>
) => {
  const dataToUpdate = {
    isCompleted: true,
  };
  mutate(
    `/api/projects/${project.id}/todos`,
    (data: { data: Todo[] }) => {
      if (!data) return data;
      return { data: data.data.filter((ele) => ele.id !== todo.id) };
    },
    false
  );

  const response = await fetch(
    `/api/projects/${project.id}/todos/${todo!.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToUpdate),
    }
  );

  if (!response.ok) {
    console.log("resose not ok at todoDone", response.body);
    mutate(
      `/api/projects/${project.id}/todos`,
      (data: { data: Todo[] }) => {
        if (!data) return data;
        return { data: [...data.data, todo] };
      },
      false
    );
  }
  mutate(`/api/projects/${project.id}/todos`);
};

export default todoDone;
