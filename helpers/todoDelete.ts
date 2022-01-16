import { Project, Todo } from "@prisma/client";
import { ScopedMutator } from "swr/dist/types";
const todoDelete = async (
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
      if (!data) return data;
      return { data: data.data.filter((ele) => ele.id !== todo.id) };
    },
    false
  );

  const response = await fetch(
    `/api/projects/${project.id}/todos/${todo!.id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
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

export default todoDelete;
