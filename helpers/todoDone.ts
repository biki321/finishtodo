import { Project, Todo } from "@prisma/client";
import { ScopedMutator } from "swr/dist/types";
const todoDone = async (
  project: Project,
  todo: Todo,
  mutate: ScopedMutator<any>
) => {
  const updatedTodo = {
    isCompleted: true,
  };
  mutate(
    `/api/projects/${project.id}/todos`,
    (data: { data: Todo[] }) => {
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
      body: JSON.stringify(updatedTodo),
    }
  );

  if (!response.ok) {
    mutate(
      `/api/projects/${project.id}/todos`,
      (data: { data: Todo[] }) => {
        return { data: [...data.data, todo] };
      },
      false
    );
  }
  mutate(`/api/projects/${project.id}/todos`);
};

export default todoDone;
